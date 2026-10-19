import { useState } from 'react'
import './App.css'
import './main.css'
import Navbar from './componentes/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Registro from './componentes/Contraseña/Registro'
import Login from './componentes/Contraseña/Login'
import Dashboard from './Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes><Route path="/"
                  element={
                    <header>
                    <div>
                      <h1>Bienvenido a Loochio</h1>
                       <div>
                        <div>
                            <h1>Asiste tu sentido de la vista </h1>
                            <p> L'oochio son unas gafas que analizan tus alrededores
                                para describirlo con ayuda de IA </p>
                        </div>
                    </div>
                    </div>
                    </header>
                    }
                  />
          <Route path="/componentes/Contraseña/Registro" element={<Registro/>}/>
          <Route path="/componentes/Contraseña/Login" element={<Login/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
      
  </div>
    
  )
}

export default App
