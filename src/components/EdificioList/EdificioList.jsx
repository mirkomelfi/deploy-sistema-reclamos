import {Edificio} from "../Edificio/Edificio"
import { Link } from "react-router-dom";

const EdificioList = ({listaEdificios})=>{

    return (
        <>
        {listaEdificios&&
        <div className="contenedorProductos">
            {listaEdificios.map(edificio => <Edificio key={edificio.id} edificio={edificio}/>)}
        </div>
        }
        </>
    )
}
export  {EdificioList}