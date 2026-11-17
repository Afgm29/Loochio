
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import {
    collection,
    doc,
    getDoc,
    getDocs
} from "firebase/firestore";

import { db } from "../../../firebase";

const Gps = function () {
    const [datos, setDatos] = useState({});
    const [imagen, setImagen] = useState("");
    const [fechaImagen, setFechaImagen] = useState(null);
    const [cargandoImagen, setCargandoImagen] = useState(false);
    const [errorImagen, setErrorImagen] = useState("");
    const [actualizar, setActualizar] = useState(false);

    // Referencia para controlar la desaparición de la imagen
    const temporizadorImagen = useRef(null);

    // ==========================================
    // CARGAR IMAGEN DESDE FIRESTORE
    // ==========================================
    const cargarImagen = async () => {
        setCargandoImagen(true);
        setErrorImagen("");

        // Cancelar temporizador anterior
        if (temporizadorImagen.current) {
            clearTimeout(temporizadorImagen.current);
            temporizadorImagen.current = null;
        }

        try {
            const referencia = doc(
                db,
                "emergency_images",
                "ultima_emergencia"
            );

            // Primero obtener el documento
            const documento = await getDoc(referencia);

            if (!documento.exists()) {
                setImagen("");
                setFechaImagen(null);
                return;
            }

            // Ahora sí podemos obtener los metadatos
            const metadata = documento.data();

            console.log("[FIREBASE] Metadatos:", metadata);

            // Obtener fecha de captura
            const fechaUTC = metadata.fechaUTC;

            if (!fechaUTC) {
                throw new Error("El documento no contiene fechaUTC");
            }

            const fecha = fechaUTC?.toDate
                ? fechaUTC.toDate()
                : new Date(fechaUTC);

            if (Number.isNaN(fecha.getTime())) {
                throw new Error("La fecha de la imagen no es válida");
            }

            setFechaImagen(fecha);

            // Comprobar antigüedad de la imagen
            const quinceMinutos = 15 * 60 * 1000;
            const tiempoTranscurrido = Date.now() - fecha.getTime();

            if (
                tiempoTranscurrido >= quinceMinutos ||
                tiempoTranscurrido < 0
            ) {
                console.log("[FIREBASE] Imagen vencida");

                setImagen("");
                return;
            }

            // Obtener fragmentos
            const referenciaFragmentos = collection(
                db,
                "emergency_images",
                "ultima_emergencia",
                "fragmentos"
            );

            const resultado = await getDocs(referenciaFragmentos);

            const fragmentos = resultado.docs
                .map((fragmento) => fragmento.data())
                .sort((a, b) => a.indice - b.indice);

            const numeroFragmentos = metadata.numeroFragmentos;

            if (
                typeof numeroFragmentos === "number" &&
                fragmentos.length !== numeroFragmentos
            ) {
                throw new Error(
                    `Imagen incompleta: ${fragmentos.length}/${numeroFragmentos} fragmentos`
                );
            }

            if (fragmentos.length === 0) {
                throw new Error("No se encontraron fragmentos de imagen");
            }

            // Reconstruir la cadena Base64
            const base64 = fragmentos
                .map((fragmento) => fragmento.contenido)
                .join("");

            if (!base64) {
                throw new Error("La cadena Base64 está vacía");
            }

            // Mostrar imagen
            setImagen(`data:image/jpeg;base64,${base64}`);

            console.log("[FIREBASE] Imagen reconstruida correctamente");

            // Programar desaparición automática a los 15 minutos
            const tiempoRestante = quinceMinutos - tiempoTranscurrido;

            temporizadorImagen.current = setTimeout(() => {
                setImagen("");
                setFechaImagen(null);
                console.log("[FIREBASE] Imagen retirada por antigüedad");
            }, tiempoRestante);

        } catch (error) {
            console.error("[FIREBASE] Error cargando imagen:", error);
            setImagen("");
            setErrorImagen(error.message);
        } finally {
            setCargandoImagen(false);
        }
    };

    // ==========================================
    // ACTUALIZACIÓN AUTOMÁTICA
    // ==========================================
    useEffect(() => {
        let componenteActivo = true;

        const actualizarDashboard = async () => {

            // Consultar ThingSpeak
            try {
                const respuesta = await fetch(
                    "https://api.thingspeak.com/channels/3538878/feeds.json?api_key=6WHGRZZR5CFM99AW&results=1"
                );

                if (!respuesta.ok) {
                    throw new Error("Error consultando ThingSpeak");
                }

                const data = await respuesta.json();
                const feed = data.feeds?.[data.feeds.length - 1];

                if (feed && componenteActivo) {
                    setDatos({
                        latitud: feed.field3,
                        longitud: feed.field4,
                        estadoRaspberry: feed.field5,
                        estadoGPS: feed.field6,
                        emergencia: feed.field7,
                        fecha: feed.created_at
                    });
                }

            } catch (error) {
                console.error("[THINGSPEAK] Error:", error);
            }

            // Consultar Firestore
            if (componenteActivo) {
                await cargarImagen();
            }
        };

        // Primera consulta al entrar al dashboard
        actualizarDashboard();

        // Actualizar automáticamente cada 15 segundos
        const intervalo = setInterval(() => {
            actualizarDashboard();
        }, 15000);

        return () => {
            componenteActivo = false;
            clearInterval(intervalo);

            if (temporizadorImagen.current) {
                clearTimeout(temporizadorImagen.current);
            }
        };

    }, [actualizar]);

    // ==========================================
    // MAPA
    // ==========================================
    const mapaDisponible =
        datos.latitud !== undefined &&
        datos.longitud !== undefined &&
        datos.latitud !== "" &&
        datos.longitud !== "";

    const mapas = mapaDisponible
        ? `https://maps.google.com/maps?q=${datos.latitud},${datos.longitud}&z=16&output=embed`
        : "";

    // ==========================================
    // BOTÓN DE ACTUALIZACIÓN MANUAL
    // ==========================================
    const refrezcar = () => {
        setActualizar((valor) => !valor);
    };

    // ==========================================
    // INDICADOR DE ESTADO
    // ==========================================
    const Estado = ({ activo, textoActivo, textoInactivo }) => (
        <span style={{ color: activo ? "green" : "red" }}>
            <FontAwesomeIcon icon={activo ? faCheck : faXmark} />
            {" "}
            {activo ? textoActivo : textoInactivo}
        </span>
    );

    // ==========================================
    // INTERFAZ
    // ==========================================
    return (
        <div style={{
            width: "90%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "30px"
        }}>

            <h2>Ubicación del dispositivo</h2>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "30px"
            }}>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    color: "black"
                }}>

                    <p>Latitud: {datos.latitud ?? "Sin datos"}</p>
                    <p>Longitud: {datos.longitud ?? "Sin datos"}</p>

                    <p>
                        Estado de la Raspberry Pi:{" "}
                        <Estado
                            activo={String(datos.estadoRaspberry) === "1"}
                            textoActivo="Activa"
                            textoInactivo="Sin conexión"
                        />
                    </p>

                    <p>
                        Estado del GPS:{" "}
                        <Estado
                            activo={String(datos.estadoGPS) === "1"}
                            textoActivo="Conectado"
                            textoInactivo="Sin señal"
                        />
                    </p>

                    <p>
                        Emergencia:{" "}
                        <Estado
                            activo={String(datos.emergencia) === "1"}
                            textoActivo="Activa"
                            textoInactivo="Inactiva"
                        />
                    </p>

                    <p>
                        Última actualización:{" "}
                        {datos.fecha
                            ? new Date(datos.fecha).toLocaleString()
                            : "Sin datos"}
                    </p>

                    <button
                        style={{
                            backgroundColor: "gold",
                            color: "black",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        onClick={refrezcar}
                    >
                        Actualizar
                    </button>
                </div>

                <div style={{
                    width: "min(100%, 550px)",
                    minWidth: "280px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "10px",
                    borderRadius: "10px"
                }}>

                    {mapaDisponible ? (
                        <iframe
                            title="Ubicación de Loochio"
                            src={mapas}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            loading="lazy"
                        />
                    ) : (
                        <p style={{ color: "white" }}>
                            No hay coordenadas disponibles.
                        </p>
                    )}

                </div>
            </div>

            <hr style={{ margin: "35px 0" }} />

            <h2>Última imagen de emergencia</h2>

            {cargandoImagen && <p>Cargando imagen...</p>}

            {errorImagen && (
                <p style={{ color: "red" }}>
                    {errorImagen}
                </p>
            )}

            {imagen ? (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px"
                }}>

                    <img
                        src={imagen}
                        alt="Última captura de emergencia"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "500px",
                            objectFit: "contain",
                            borderRadius: "10px"
                        }}
                    />

                    <p>
                        Fecha de captura:{" "}
                        {fechaImagen
                            ? fechaImagen.toLocaleString()
                            : "No disponible"}
                    </p>

                </div>
            ) : (
                !cargandoImagen && !errorImagen && (
                    <p>No hay imágenes de emergencia recientes.</p>
                )
            )}

        </div>
    );
};

export default Gps;
