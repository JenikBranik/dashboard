import { LanguageProvider } from './i18n/LanguageContext'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

// Protects routes from unauthenticated users
function AuthGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

import OverviewView from './components/views/OverviewView'
import CalendarView from './components/views/CalendarView'

// Wrapper component to handle routing animations
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Guest Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>}>
          <Route index element={<OverviewView />} />
          <Route path="calendar" element={<CalendarView />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
