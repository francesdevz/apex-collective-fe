import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import NavigationBar from './components/ui/NavigationBarComponent'
import Loginpage from './view/Loginpage'

function App() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  )
}

function RouterContent() {
  const location = useLocation();
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