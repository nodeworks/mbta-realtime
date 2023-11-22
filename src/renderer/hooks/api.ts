import { useCallback, useEffect } from 'react'

const BASE_URL = process?.env?.BASE_URL
const API_KEY = process?.env?.API_KEY

interface Props {
  routesHandler?: (evt: MessageEvent<any>) => void
  linesHandler?: (evt: MessageEvent<any>) => void
  vehiclesHandler?: (evt: MessageEvent<any>) => void
  alertsHandler?: (evt: MessageEvent<any>) => void
  schedulesHandler?: (evt: MessageEvent<any>) => void
  tripsHandler?: (evt: MessageEvent<any>) => void
  stopsHandler?: (evt: MessageEvent<any>) => void
}

interface Entities {
  [index: string]: {
    stream: EventSource | null
    events: string[]
    filter?: any
    include?: string
  }
}

const entities: Entities = {
  routes: {
    stream: null,
    events: ['reset']
  },
  lines: {
    stream: null,
    events: ['reset']
  },
  vehicles: {
    stream: null,
    events: ['reset', 'add', 'update', 'remove'],
    filter: 'filter[route_type]=0,1',
    include: 'route,trip,trip.predictions'
  },
  alerts: {
    stream: null,
    events: ['reset', 'add', 'update', 'remove'],
    filter: 'filter[datetime]=NOW'
  },
  stops: {
    stream: null,
    events: ['reset', 'add', 'update', 'remove'],
    filter: 'filter[route_type]=0,1'
  }
}

// eslint-disable-next-line
export const useAPI = ({
  routesHandler,
  linesHandler,
  vehiclesHandler,
  alertsHandler,
  schedulesHandler,
  tripsHandler,
  stopsHandler
}: Props) => {
  const init = useCallback(async () => {
    Object.entries(entities).forEach(([key, entity]) => {
      if (!entity.stream) {
        const stream = new EventSource(
          `${BASE_URL}/${key}?api_key=${API_KEY}${
            entity?.include ? `&include=${entity.include}` : ''
          }${entity?.filter ? `&${entity.filter}` : ''}`
        )

        stream.onerror = () => {
          // Do nothing.
        }

        entity.events.forEach((event) => {
          stream.addEventListener(event, async (evt) => {
            switch (key) {
              case 'routes':
                if (routesHandler) {
                  routesHandler(evt)
                }

                break

              case 'lines':
                if (linesHandler) {
                  linesHandler(evt)
                }

                break

              case 'vehicles':
                if (vehiclesHandler) {
                  vehiclesHandler(evt)
                }

                break

              case 'alerts':
                if (alertsHandler) {
                  alertsHandler(evt)
                }

                break

              case 'schedules':
                if (schedulesHandler) {
                  schedulesHandler(evt)
                }

                break

              case 'trips':
                if (tripsHandler) {
                  tripsHandler(evt)
                }

                break

              case 'stops':
                if (stopsHandler) {
                  stopsHandler(evt)
                }

                break

              default:
                break
            }
          })
        })

        entities[key].stream = stream
      }
    })
    // eslint-disable-next-line
  }, [])

  const unsubscribe = () => {
    Object.entries(entities).forEach(([key, entity]) => {
      if (entity.stream) {
        entity.stream.close()
        entities[key].stream = null
      }
    })
  }

  useEffect(() => {
    init()

    return () => {
      unsubscribe()
    }
  }, [init])

  return { entities }
}
