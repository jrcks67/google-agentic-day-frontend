import React from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/public/Home'
import SigninPage from './pages/public/SigninPage'
import SignupPage from './pages/public/SignupPage'
import Dashboard from './pages/private/Dashboard'
import ClassesPage from './pages/private/ClassesPage'
import ChatPage from './pages/private/ChatPage'
import SettingsPage from './pages/private/SettingsPage'


// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
