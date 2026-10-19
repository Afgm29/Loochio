import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck,faXmark} from "@fortawesome/free-solid-svg-icons";

const Gps= function() {
    const [Datos, setDatos] = useState({});
    const [Mapas, setMapas] = useState("https://maps.google.com/maps?q=${},${}&z=16&output=embed");
    const [boton, setBoton] = useState(true);
    const [conexion, setConexion] = useState(false);
    const [cargando, setCargando] = useState(true);
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
            setMapas("https://maps.google.com/maps?q="+Datos.latitud+","+Datos.longitud+"&z=16&output=embed");
            
        })
    }, [boton])
    const refrezcar = function(){
        setBoton(!boton);
    }
return(
    <div>
        <h2>{Datos && Datos.latitud}</h2>
        <h2>{Datos && Datos.longitud}</h2>
        <h2>{Mapas}</h2>
        <iframe src={Mapas} width="500" height="300"></iframe>
        <button onClick={refrezcar}>Refrezcar</button>
    </div>
)
    
};
export default Gps;