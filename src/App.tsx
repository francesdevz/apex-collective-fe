import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import NavigationBar from './components/layout/NavigationBarComponent'
import Loginpage from './view/Loginpage'
import { verifyTokenStart, refreshTokenStart } from './store/reducer/authSlice'
import type { RootState } from './store/store'
import { useDispatch, useSelector } from 'react-redux'

function App() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  )
}

function RouterContent() {
  const location = useLocation();

  const { isAuthenticated, isRefreshing } = useSelector(
    (state: RootState) => state.auth
  )

  console.log("Auth State in App.tsx:", { isAuthenticated, isRefreshing })

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <NavigationBar />
      )}
      <Routes>
        <Route path="/login" element={<Loginpage />} />
      </Routes>
    </>
  )
}

export default App