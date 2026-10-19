import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./Authprovider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase.js";

import axios from '../../Api/axios'
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

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
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Log In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
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
                        Need an Account?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login