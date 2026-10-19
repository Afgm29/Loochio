import {useRef, useEffect, useState} from 'react'
import '../index.css'
import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../Api/axios'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase.js";

const USER_REGEX =/^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Registro = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser]= useState('');
    const [nvalido,setNvalido] =useState(false);
    const [nseleccionado,setNseleccionado] =useState(false);

    const [email, setEmail] = useState('');
    const [evalido, setEValido] = useState(false);
    const [eseleccionado,setEseleccionado] =useState(false);

    const [contraseña, setContraseña]= useState('');
    const [cvalido,setCvalido] =useState(false);
    const [cseleccionado,setcseleccionado] =useState(false);

    const [confirmar, setConfirmar]= useState('');
    const [mvalido,setMvalido] =useState(false);
    const [mseleccionado,setMseleccionado] =useState(false);

    const [errMsj, setErrMsj]= useState('');
    const [aceptar, setAceptar]=useState(false);

    useEffect(()=>{
        userRef.current.focus();
    }, [])
     useEffect(()=>{
        const resultado = USER_REGEX.test(user);
        setNvalido(resultado);
    }, [user])
    useEffect(() => {
        const resultado = EMAIL_REGEX.test(email);
        setEValido(resultado);
    }, [email]);
    useEffect(()=>{
        const resultado = PWD_REGEX.test(contraseña);
        setCvalido(resultado);
        const igual = contraseña == confirmar;
        setMvalido(igual);
    }, [contraseña,confirmar])

    useEffect(()=>{
        setErrMsj('');
    }, [user, email, contraseña, confirmar])

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(contraseña);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3){
            setErrMsj("Entrada invalida")
            return;
        }
        try{
            const response = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    contraseña
            );
            await setDoc(doc(db, "usuarios", response.user.uid), {
                usuario: user, email: email, fechaRegistro: serverTimestamp() 
            });
            setAceptar(true);
        }catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setErrMsj("Este correo ya está registrado");
            } else if (err.code === "auth/weak-password") {
                setErrMsj("La contraseña es demasiado débil");
            } else if (err.code === "auth/invalid-email") {
                setErrMsj("El correo electrónico no es válido");
            } else {
                setErrMsj("No se pudo completar el registro");
            }
        }
    }
  return (
    <>
        {aceptar ? (
                <section>
                    <h1>Registrado!</h1>
                    <p>
                        <a href='#'>Sign In</a>
                    </p>
                </section>
            ) : (
            <section>
                <p ref={errRef} className={errMsj ? "errmsg": "offscreen"} aria-live='assertive'>{errMsj}</p>
                <h1>Registro</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username:
                        <span className={nvalido ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={nvalido || !user ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete='off'
                        onChange={(e)=>setUser(e.target.value)}
                        required
                        aria-invalid={nvalido? "false":"true"}
                        aria-describedby='uidnote'
                        onFocus={() => setNseleccionado(true)}
                        onBlur={() => setNseleccionado(false)}

                    />
                    <p id='uidnote'className={nseleccionado && user && !nvalido ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 a 24 caracteres.<br />
                        debe iniciar con una letra.<br />
                    </p>
                    <label htmlFor="email">
                        Email:
                        <span className={evalido ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={evalido || !email ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        aria-invalid={evalido? "false":"true"}
                        onFocus={() => setEseleccionado(true)}
                        onBlur={() => setEseleccionado(false)}

                    />
                    
                    <label htmlFor="password">
                        contraseña:
                        <span className={cvalido ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={cvalido || !contraseña ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e)=>setContraseña(e.target.value)}
                        required
                        aria-invalid={cvalido? "false":"true"}
                        aria-describedby='pwdnote'
                        onFocus={() => setcseleccionado(true)}
                        onBlur={() => setcseleccionado(false)}

                    />
                    <p id='pwdnote'className={cseleccionado && contraseña && !cvalido ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 a 24 caracteres.<br />
                        Debe incluir al menos una de las siguientes: minuscula, mayuscula, numero y un caracter especial.<br />
                        Caracteres especiales admitidos:<span aria-label='exclamation mark'>!</span><span aria-label='at symbol'>@</span><span aria-label='#'>#</span><span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
                    </p>


                    <label htmlFor="confirm_pwd">
                        confirmar contraseña:
                        <span className={mvalido ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={mvalido || !confirmar ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e)=>setConfirmar(e.target.value)}
                        required
                        aria-invalid={mvalido? "false":"true"}
                        aria-describedby='confirmnote'
                        onFocus={() => setMseleccionado(true)}
                        onBlur={() => setMseleccionado(false)}

                    />
                    <p id='confirmnote'className={mseleccionado && confirmar && !mvalido ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Debe coincidir con la contraseña introducida.<br />
                    </p>
                    <button disabled={!nvalido || !evalido || !cvalido || !mvalido ? true : false}>sign up </button>
                </form>
                <p>
                    ¿Ya estas registra      do?<br />
                    <span className='line'>
                        <a href='/componentes/Contraseña/Login'>Sign In</a>
                    </span>
                </p>
                </section>
            )
        }
    </>
  )
}

export default Registro