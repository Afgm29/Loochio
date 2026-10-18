import { useState } from 'react'
import './App.css'
import './main.css'
import Counter from './Counter'
import Gps from './componentes/ThingSpeak/Gps'
import Navbar from './componentes/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Registro from './componentes/Contraseña/Registro'
import Login from './componentes/Contraseña/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes><Route path="/"
                  element={
                    <div>
                      <h1>Bienvenido a Loochio</h1>
                      <p>
                        Loochio es un sistema de gafas inteligentes
                        que ayuda a personas con discapacidad visual
                        a identificar objetos y obstáculos del entorno.
                      </p>
                    </div>
                    }
                  />
          <Route path="/componentes/Contraseña/Registro" element={<Registro/>}/>
          <Route path="/componentes/Contraseña/Login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
      
  </div>
    
  )
}

export default App
