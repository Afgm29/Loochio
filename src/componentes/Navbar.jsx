import React from 'react'
import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <nav className='navbar'>
        <a href="/" className='logo'><h1 style={{color: "#D4AF37" }}>Loochio</h1></a>
        <ul className='menu'>
            <li><a className='menu-link' href='/' style={{color: "#D4AF37" }}>Inicio</a></li>
            <li><a className='menu-link' href='/componentes/Contraseña/Registro' style={{color: "#D4AF37" }}>Sign Up</a></li>
            <li><a className='menu-link' href='/componentes/Contraseña/Login' style={{color: "#D4AF37" }}>Log In</a></li>
            <li><a className='menu-link' href='/dashboard.html' style={{color: "#D4AF37" }}>Dashboard</a></li>
        </ul>
    </nav>
  )
}

export default Navbar