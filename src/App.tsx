import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/ui/NavigationBarComponent'

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
      </Routes>
    </BrowserRouter>
  )
}

export default App
