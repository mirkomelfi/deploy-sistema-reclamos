
import {Link, useNavigate} from "react-router-dom";

const ReclamoDetail =({reclamo})=>{
    const navigate=useNavigate()
    const navigateTo=(url)=>{
        navigate(url)
    }

    return(
        <>
            <div className="tarjetaListado">
                <h1 id="tituloGrande">Reclamo N°{reclamo.id}</h1>
                <h2>Tipo de reclamable: {reclamo.tipoReclamable}</h2>
                <h2>Id del Reclamable: {reclamo.idReclamable}</h2>
                <button class="button btnPrimary" onClick={()=>navigateTo(`${reclamo.id}`)}><span class="btnText">Ver mas</span></button>

            </div>
        </>
    )
}

export {ReclamoDetail}