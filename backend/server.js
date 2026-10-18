
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3500;

// Almacenamiento temporal de prueba.
// Después lo reemplazarás por Firebase.
const usuarios = new Map();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// REGISTRO
app.post('/Registro', async (req, res) => {
    try {
        const { user, pwd } = req.body;

        if (
            typeof user !== 'string' ||
            typeof pwd !== 'string' ||
            !USER_REGEX.test(user) ||
            !PWD_REGEX.test(pwd)
        ) {
            return res.status(400).json({
                message: 'Usuario o contraseña no válidos'
            });
        }

        const username = user.toLowerCase();

        if (usuarios.has(username)) {
            return res.status(409).json({
                message: 'Nombre de usuario previamente registrado'
            });
        }

        // Generar hash con bcrypt; el costo es 12.
        const passwordHash = await bcrypt.hash(pwd, 12);

        usuarios.set(username, {
            user,
            passwordHash
        });

        return res.status(201).json({
            message: 'Usuario registrado correctamente'
        });

    } catch (error) {
        console.error('Error en registro:', error);

        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
});

// INICIO DE SESIÓN
app.post('/auth', async (req, res) => {
    try {
        const { user, pwd } = req.body;

        if (
            typeof user !== 'string' ||
            typeof pwd !== 'string' ||
            !user ||
            !pwd
        ) {
            return res.status(400).json({
                message: 'Falta usuario o contraseña'
            });
        }

        const username = user.toLowerCase();
        const usuario = usuarios.get(username);

        if (!usuario) {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }

        // Comparar la contraseña ingresada con el hash almacenado.
        const passwordCorrecta = await bcrypt.compare(
            pwd,
            usuario.passwordHash
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }

        // Autenticación de prueba: aún no genera un token real.
        return res.status(200).json({
            message: 'Inicio de sesión correcto',
            user: usuario.user,
            roles: []
        });

    } catch (error) {
        console.error('Error en login:', error);

        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
