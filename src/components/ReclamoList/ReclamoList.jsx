import {ReclamoDetail} from "../ReclamoDetail/ReclamoDetail"


const ReclamoList = ({listaReclamos})=>{

    return (
        <>
        {listaReclamos&&
            <div className="contenedorProductos">
                {listaReclamos.map(reclamo => <ReclamoDetail key={reclamo.id} reclamo={reclamo}/>)}
            </div>
        }
        </>

    )
}
export  {ReclamoList}