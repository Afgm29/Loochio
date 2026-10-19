import React from 'react'
import { Link } from 'react-router-dom'
import '../main.css'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link to="/" className='logo'><h1 style={{color: "#D4AF37" }}>Loochio</h1></Link>
        <ul className='menu'>
            <li><Link className='menu-link' to='/' style={{color: "#D4AF37" }}>Inicio</Link></li>
            <li><Link className='menu-link' to='/componentes/Contraseña/Registro' style={{color: "#D4AF37" }}>Sign Up</Link></li>
            <li><Link className='menu-link' to='/componentes/Contraseña/Login' style={{color: "#D4AF37" }}>Log In</Link></li>
            <li><Link className='menu-link' to='/Dashboard' style={{color: "#D4AF37" }}>Dashboard</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar