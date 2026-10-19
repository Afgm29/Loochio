import { useState } from 'react'
import './App.css'
import './main.css'
import Navbar from './componentes/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Registro from './componentes/Contraseña/Registro'
import Login from './componentes/Contraseña/Login'
import Dashboard from './Dashboard'
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes><Route path="/"
                  element={
                    <>
                      <header>
                      <div style={{textAlign: 'center', color: 'black', fontFamily: "Poppins, sans-serif",fontWeight: "800",letterSpacing: "-1px"}} >
                        <h1>Bienvenido a Loochio</h1>
                        <h1>Asiste tu sentido de la vista </h1><br/>
                      </div>
                      <div style={{textAlign: 'center', color: 'black'}} >
                              <p> Loochio es un proyecto de gafas inteligentes diseñado para apoyar a personas con discapacidad visual en sus actividades cotidianas. Mediante inteligencia artificial y tecnologías de detección, busca reconocer objetos y obstáculos del entorno, proporcionando información auditiva que facilite la orientación y promueva una mayor autonomía y seguridad para sus usuarios.</p> <br/>
                      </div>

                      </header>

                      <main>
                        <div style={{ textAlign: 'center' }}>
                          <img
                            src="/WhatsApp Image 2026-09-23 at 10.31.53 PM.jpeg"
                            alt="Gafas inteligentes Loochio"
                            width="800"
                            height="400"
                            style={{ borderRadius: "20px" }}
                          />
                        </div>
                      </main>
                      <main>
                      <div
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", padding: "40px", width: "90%", maxWidth: "1000px", margin: "0 auto"}}
                        >   
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", borderRadius: "10px", padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
                              <h2>¿Qué puede hacer Loochio?</h2>
                              <ul>
                                  <li>
                                      <strong>Análisis de imágenes:</strong>
                                      Identifica objetos y posibles obstáculos del entorno mediante inteligencia artificial.
                                  </li>
                                  <li>
                                      <strong>Geolocalización GPS:</strong>
                                      Obtiene las coordenadas geográficas del usuario.
                                  </li>
                                  <li><strong>Botón de emergencia:</strong> 
                                  permite activar una alerta.
                                  </li>
                                  <li>
                                      <strong>Monitoreo remoto:</strong>
                                      Permite que un cuidador consulte la ubicación del usuario desde la interfaz web.
                                  </li>
                              </ul>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", borderRadius: "10px", padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
                                <h2>¿Qué utilizamos?</h2>
                              <ul>
                                <li><strong>Raspberry Pi:</strong> procesa las imágenes y detecta objetos.</li>
                                <li><strong>GPS:</strong> permite conocer la ubicación del usuario.</li>
                                <li><strong>Cámara:</strong> captura el entorno para analizarlo.</li>
                              </ul>
                            </div>
                        </div>
                        <div style={{ textAlign: "center",margin: "20px auto", borderRadius: "10px", padding: "10px",maxWidth: "910px",maxHeight: "400px", backgroundColor: "rgba(108, 93, 9, 0.75)" }}>
                          <p>
                            La discapacidad visual representa una problemática importante en Colombia, ya que limita la movilidad, la orientación y la autonomía de muchas personas en sus actividades cotidianas. Se estima que el país cuenta con alrededor de 1,9 millones de personas con discapacidad visual, además de muchas otras con diferentes dificultades de visión. Esta situación evidencia la necesidad de desarrollar soluciones tecnológicas accesibles, como Loochio, que utiliza inteligencia artificial y GPS para ayudar a identificar el entorno y facilitar el seguimiento de la ubicación del usuario. 
                          </p>
                        </div>
                      </main>
                      <footer>
                        <div style={{ backgroundColor: "black", color: "gold", textAlign: 'center' }} >

                        <p>Loochio - Proyecto de gafas inteligentes</p>
                        <p>© 2026 Loochio</p>
                         </div>
                      </footer>
                     </>
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
