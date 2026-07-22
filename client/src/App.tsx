import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import './styles/global.css'
import './styles/export.css'
import './styles/demo.css'
import './styles/priority.css'
import './styles/search.css'
import './styles/history.css'
import './styles/about.css'
import './styles/preview.css'

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  if (pathname === '/about') return <AboutPage />
  return <HomePage />
}
