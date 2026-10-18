import React, { useEffect, useState } from "react";

const Gps= function() {
    const [Datos, setDatos] = useState();
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
            setDatos({ latitud, longitud });
            setMapas("https://maps.google.com/maps?q="+latitud+","+longitud+"&z=16&output=embed");
            
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