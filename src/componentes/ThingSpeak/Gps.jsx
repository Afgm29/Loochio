import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck,faXmark} from "@fortawesome/free-solid-svg-icons";

const Gps= function() {
    const [Datos, setDatos] = useState({});
    const [Mapas, setMapas] = useState("https://maps.google.com/maps?q=${},${}&z=16&output=embed");
    const [boton, setBoton] = useState(true);
    useEffect(()=>{
        fetch("https://api.thingspeak.com/channels/3538878/feeds.json?api_key=6WHGRZZR5CFM99AW&results=2")
        .then((resp) => resp.json())
        .then((data) =>{
            const feed = data.feeds?.[data.feeds.length - 1];

            if (!feed || !feed.field3 || !feed.field4) {
                throw new Error("No hay coordenadas disponibles");
            }
            const latitud = feed.field3;
            const longitud = feed.field4;
            const estadoGPS = feed.field5;
            setDatos({ latitud, longitud, estadoGPS });
        })
    }, [boton])
    useEffect(() => {
            if (Datos.latitud && Datos.longitud) {
                setMapas("https://maps.google.com/maps?q="+Datos.latitud+","+Datos.longitud+"&z=16&output=embed");
            }
        }, [Datos.latitud, Datos.longitud]);

    const refrezcar = function(){
        setBoton(!boton);
    }
return(
    
    <div>
        <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", padding: "40px", width: "90%", maxWidth: "1000px", margin: "0 auto"}}
        >   
            <div style={{ textAlign: "left",display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",color: "black"}}>
                <p>latitud: {Datos && Datos.latitud}</p>
                <p>longitud: {Datos && Datos.longitud}</p><br />
                <p>Estado del GPS: {Datos && Datos.estadoGPS === "1" ? (
                    <span style={{ color: "green" }}>
                        <FontAwesomeIcon icon={faCheck} /> Conectado
                    </span>
                ) : (
                    <span style={{ color: "red" }}>
                        <FontAwesomeIcon icon={faXmark} /> Desconectado
                    </span>
                )}</p>
                <div style={{ alignItems: "center" }}>
                    <button style={{ backgroundColor: "gold", color: "black" }} onClick={refrezcar}>
                        Refrezcar
                    </button>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", borderRadius: "10px", padding: "10px", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <iframe src={Mapas} width="500" height="300"></iframe>
            </div>
        </div>
    </div>
)
    
};
export default Gps;