import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { RecoilRoot } from 'recoil'
import Dashboard from '@pages/dashboard'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '@nworks-renderer/styles.scss'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2aa6b8',
          colorLink: '#2aa6b8',
          colorSuccess: '#38cda8',
          colorInfo: '#4ab1c1',
          colorWarning: '#ffa700',
          colorError: '#f62712',
          colorBgLayout: '#f0f2f5',
          fontSize: 14,
          borderRadius: 4,
          fontWeightStrong: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        },
        components: {
          Layout: {
            headerBg: '#313131',
            controlHeightLG: 12
          },
          Tabs: {
            colorFillAlter: '#fafafa'
          },
          Tooltip: {
            colorBgLayout: '#ffffff',
            colorBgDefault: '#ffffff',
            colorBgBase: '#ffffff',
            colorBgContainer: '#ffffff'
          },
          Menu: {
            colorBgLayout: '#313131',
            colorBgBase: '#313131',
            colorBgContainer: '#313131',
            itemBg: '#313131',
            subMenuItemBg: '#313131',
            // @ts-ignore
            menuSubMenuBg: '#313131',
            itemBorderRadius: 0,
            itemActiveBg: '#2aa6b8',
            itemSelectedBg: '#2aa6b8',
            horizontalItemSelectedBg: '#2aa6b8',
            horizontalItemSelectedColor: '#ffffff',
            itemMarginInline: 0
          }
        }
      }}
    >
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path='/' element={<Dashboard />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </ConfigProvider>
  )
}
