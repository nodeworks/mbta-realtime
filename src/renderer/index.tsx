import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/electron/renderer'
import * as SentryBrowser from '@sentry/browser'
import { init as reactInit } from '@sentry/react'
import App from './App'

Sentry.init(
  {
    dsn: 'https://789f2f4ebf83d74555ec1f7007fc7777@o868269.ingest.sentry.io/4506266631602176',
    replaysSessionSampleRate: 1.0,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    // @ts-ignore
    integrations: [
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
        networkDetailAllowUrls: ['api-v3.mbta.com', 'localhost']
      }),
      new SentryBrowser.BrowserTracing(),
      new SentryBrowser.BrowserProfilingIntegration()
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    // tracePropagationTargets: ['localhost'],
    profilesSampleRate: 1.0
  },
  // @ts-ignore
  reactInit
)

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)

// // calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg)
// })
//
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping'])
