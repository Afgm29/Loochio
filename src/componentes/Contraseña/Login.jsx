import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./Authprovider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase.js";


const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

       try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                pwd
            );

            setAuth({
                user: response.user.email,
                roles: []
            });

            setEmail("");
            setPwd("");
            setSuccess(true);
        } catch (err) {
            if (err.code === "auth/invalid-credential") {
                setErrMsg("Correo o contraseña incorrectos");
            } else if (err.code === "auth/too-many-requests") { 
                setErrMsg("Demasiados intentos. Intenta más tarde.");
            } else {
                 setErrMsg("No se pudo iniciar sesión");
                }

                errRef.current?.focus();
            }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="../../Dashboard">Ir al dashboard</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Log In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Correo:</label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        ¿No tienes cuenta?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/componentes/Contraseña/Registro">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login