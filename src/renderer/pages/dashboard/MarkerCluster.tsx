import React from 'react'
import {
  extendContext,
  createElementObject,
  createPathComponent,
  LeafletContextInterface
} from '@react-leaflet/core'
import L, { LeafletMouseEventHandlerFn } from 'leaflet'
import 'leaflet.markercluster'

//webpack failing when loading leaflet marker icon
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
})

type ClusterType = { [key in string]: any }

type ClusterEvents = {
  onClick?: LeafletMouseEventHandlerFn
  onDblClick?: LeafletMouseEventHandlerFn
  onMouseDown?: LeafletMouseEventHandlerFn
  onMouseUp?: LeafletMouseEventHandlerFn
  onMouseOver?: LeafletMouseEventHandlerFn
  onMouseOut?: LeafletMouseEventHandlerFn
  onContextMenu?: LeafletMouseEventHandlerFn
}

// @ts-ignore
type MarkerClusterControl = L.MarkerClusterGroupOptions & {
  children: React.ReactNode
} & ClusterEvents

function getPropsAndEvents(props: MarkerClusterControl) {
  let clusterProps: ClusterType = {}
  let clusterEvents: ClusterType = {}
  const { children, ...rest } = props
  // Splitting props and events to different objects
  Object.entries(rest).forEach(([propName, prop]) => {
    if (propName.startsWith('on')) {
      clusterEvents = { ...clusterEvents, [propName]: prop }
    } else {
      clusterProps = { ...clusterProps, [propName]: prop }
    }
  })
  return { clusterProps, clusterEvents }
}

function createMarkerClusterGroup(
  props: MarkerClusterControl,
  context: LeafletContextInterface
) {
  const { clusterProps, clusterEvents } = getPropsAndEvents(props)
  // @ts-ignore
  const markerClusterGroup = new L.MarkerClusterGroup(clusterProps)
  Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
    const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`
    markerClusterGroup.on(clusterEvent, callback)
  })

  return createElementObject(
    markerClusterGroup,
    extendContext(context, { layerContainer: markerClusterGroup })
  )
}

const updateMarkerCluster = (
  // @ts-ignore
  instance: L.MarkerClusterGroup,
  props: MarkerClusterControl,
  prevProps: MarkerClusterControl
) => {
  instance.refreshClusters()
}

const MarkerClusterGroup = createPathComponent<
  // @ts-ignore
  L.MarkerClusterGroup,
  MarkerClusterControl
>(createMarkerClusterGroup, updateMarkerCluster)

export default MarkerClusterGroup
