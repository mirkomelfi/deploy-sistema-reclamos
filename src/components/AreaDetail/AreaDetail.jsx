
import {Link, useNavigate} from "react-router-dom";

const AreaDetail =({area})=>{
    const navigate=useNavigate()
    const navigateTo=(url)=>{
        navigate(url)
    }

    return(
        <>
            <div className="tarjetaListado">
                <h1>Area N°{area.id}</h1>
                <h2>Nombre: {area.nombre}</h2>
                <h2>Piso: {area.piso}</h2>
                <button class="button btnPrimary" onClick={()=>navigateTo(`${area.id}`)}><span class="btnText">Ver area</span></button>


            </div>
        </>
    )
}

export {AreaDetail}