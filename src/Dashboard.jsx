import Gps from './componentes/ThingSpeak/Gps'
import Navbar from './componentes/Navbar'
import './main.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'

function Dashboard() {

  return (
    <div>
      <Gps/>
    </div>
    
  )
}
export default Dashboard