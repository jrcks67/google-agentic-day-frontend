import React from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './pages/public/Home'
import SigninPage from './pages/public/SigninPage'
import SignupPage from './pages/public/SignupPage'
import Sahayak from './pages/private/Sahayak'
import CreateClass from './pages/private/chat/CreateClass'


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
            <Route path="/create-class" element={<CreateClass />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Sahayak />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
