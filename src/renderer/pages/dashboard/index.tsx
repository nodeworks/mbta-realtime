import { useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import polyUtil from 'polyline-encoded'
import 'leaflet.marker.slideto'
import { useAPI } from '@hooks'
import SubwayTrainIcon from './SubwayTrainIcon'
import StopIcon from './StopIcon'
import './leaflet-marker-bearings'
import styles from './styles.module.scss'

const BASE_URL = process?.env?.BASE_URL
const API_KEY = process?.env?.API_KEY

const MBTAMap = () => {
  const mapRef = useRef<any>(null)
  const routes = useRef<any[]>([])
  const vehicles = useRef<any>({})

  useAPI({
    alertsHandler: async (evt) => {
      // eslint-disable-next-line
      const data = JSON.parse(evt.data)
      // console.log(data)
    },
    routesHandler: async (evt) => {
      const data = JSON.parse(evt.data)
      const lightAndHeavyRails = data.filter((d: any) =>
        [0, 1].includes(d.attributes.type)
      )

      routes.current = await Promise.all(
        lightAndHeavyRails.map(async (rail: any) => {
          const shapes = await fetch(
            `${BASE_URL}/shapes?api_key=${API_KEY}&filter[route]=${rail.id}`
          )

          const shapeData = await shapes.json()
          const newData = shapeData.data.reduce((agg: any[], d: any) => {
            if (d.id.startsWith('canonical')) {
              agg.push(polyUtil.decode(d.attributes.polyline))
            }

            return agg
          }, [])

          L.polyline(newData, { color: `#${rail.attributes.color}` }).addTo(
            mapRef.current
          )

          return {
            id: rail.id,
            coords: newData,
            attributes: rail.attributes
          }
        })
      )
    },
    stopsHandler: async (evt) => {
      const data = JSON.parse(evt.data)
      data.forEach((stop: any) => {
        if (mapRef.current) {
          const svgIcon = L.divIcon({
            html: StopIcon,
            iconSize: [13, 13],
            className: styles.stopIcon
          })

          if (
            mapRef.current &&
            stop?.attributes?.latitude &&
            stop?.attributes?.longitude
          )
            L.marker([stop.attributes.latitude, stop.attributes.longitude], {
              icon: svgIcon,
              title: stop?.attributes?.name
            }).addTo(mapRef.current)
        }
      })
    },
    vehiclesHandler: async (evt) => {
      const data = JSON.parse(evt.data)
      const routeData: any[] = (!Array.isArray(data) ? [data] : data).filter(
        (r) => r?.type === 'route'
      )

      // const tripData: any[] = (!Array.isArray(data) ? [data] : data).filter(
      //   (r) => r?.type === 'trip'
      // )
      //
      // const predictions: any[] = (!Array.isArray(data) ? [data] : data).filter(
      //   (r) => r?.type === 'prediction'
      // )

      const vehicleData: any[] = (!Array.isArray(data) ? [data] : data).filter(
        (v) =>
          v?.type === 'vehicle' &&
          v?.attributes?.latitude &&
          v?.attributes?.longitude
      )

      const newData: any[] = vehicleData.map((vehicle) => ({
        id: vehicle.id,
        coords: [vehicle.attributes.latitude, vehicle.attributes.longitude],
        route: vehicle?.relationships?.route?.data?.id,
        bearing: (vehicle?.attributes?.bearing || 0) + 180,
        label: vehicle?.attributes?.label
      }))

      newData.forEach((v) => {
        const route: any = routeData.find((rt: any) => rt?.id === v?.route)

        const trainColor = route?.attributes?.color
        if (vehicles.current?.[v.id]) {
          vehicles.current[v.id].setRotationAngle(v.bearing)
          vehicles.current[v.id].slideTo(v.coords, {
            duration: 500,
            keepAtCenter: false
          })
        } else {
          const svgIcon = L.divIcon({
            html: SubwayTrainIcon,
            ...(trainColor
              ? {
                  className: styles[`color${trainColor}`]
                }
              : {
                  className: ''
                }),
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          })

          if (mapRef.current) {
            vehicles.current[v.id] = L.marker(v.coords, {
              icon: svgIcon,
              // @ts-ignore
              rotationAngle: v?.bearing,
              title: v?.label
            }).addTo(mapRef.current)
          }
        }
      })
    }
  })

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <h1
        style={{
          backgroundColor: '#313131',
          color: '#ffffff',
          padding: '10px 20px',
          fontSize: 16
        }}
      >
        MBTA Map
      </h1>

      <MapContainer
        center={[42.35930500076174, -71.06042861938478]}
        zoom={12}
        style={{ height: '100%', flex: 1 }}
        ref={mapRef}
      >
        <TileLayer
          attribution=''
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        />
      </MapContainer>
    </div>
  )
}

export default MBTAMap
