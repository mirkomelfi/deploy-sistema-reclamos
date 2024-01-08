import {Edificio} from "../Edificio/Edificio"
import { UnidadDetail } from "../UnidadDetail/UnidadDetail";
import { Link } from "react-router-dom";

const UnidadList = ({listaUnidades})=>{
    
    return (
        <>
           {listaUnidades&&
           
            <div className="contenedorProductos">
                {listaUnidades.map(unidad => <UnidadDetail key={unidad.id} unidad={unidad} />)}
            </div>
            }
        </>
    )
}
export  {UnidadList}