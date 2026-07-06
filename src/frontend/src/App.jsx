import { LanguageProvider } from './i18n/LanguageContext'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Wrapper component to handle routing animations
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
