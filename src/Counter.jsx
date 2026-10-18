import { useState } from "react";

const Counter = function(){
    const [number, setNumber] = useState(0);
    const sumar = function(){
        setNumber(number+1);
    }
    return(
        <div>
            <h2>{number}</h2>
            <button onClick={sumar}>Sumar</button>
        </div>
    )
};

export default Counter;