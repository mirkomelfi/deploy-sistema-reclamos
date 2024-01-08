import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"

import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";
import { useEffect } from "react"

export const UnidadPut = () => {

    const {id}= useParams();
    const {state}=useLocation();
    const [mensaje,setMensaje]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    

    const navigateTo=(url)=>{
        navigate(url)
    }

    const datForm = useRef() //Crear una referencia para consultar los valoresa actuales del form

    const consultarForm = async(e) => {
        //Consultar los datos del formulario
        e.preventDefault()

        const datosFormulario = new FormData(datForm.current) //Pasar de HTML a Objeto Iterable
        const unidad = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        if (unidad.numero==""){unidad.numero=null;}
        if (unidad.piso==""){unidad.piso=null;}
        if (!unidad.piso&&!unidad.numero){ setMensaje("No se ingresaron valores para actualizar")}
        else{
            const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/unidades/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(unidad)
            })

            const rol=validateRol(response)
            if (!rol){
              if (isRolUser(getToken())){
                console.log("rol user")
                  setMensaje("No posee los permisos necesarios")
              }else{
                deleteToken()
                navigate("/login")
              }
            }else{
            const data = await response.json()
            if (data.msj){
              setMensaje(data.msj)
            }
            }
                
            e.target.reset() //Reset form
                
            }
        }




    return (

        <div>
            {!mensaje?(
                
                <div id="divForm" className="container" >
                    <h2>Cambio en los datos del Unidad</h2>
                    <h3>Ingrese solo los campos que desea modificar</h3>
                    <form onSubmit={consultarForm} ref={datForm}>
                        <div className="mb-3">
                            <label htmlFor="numero" className="form-label">Numero</label>
                            <input type="number" className="form-control" name="numero" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="piso" className="form-label">Piso</label>
                            <input type="number" className="form-control" name="piso" />
                        </div>

                        <button type="submit" className="button btnPrimary">Actualizar</button>
                        </form>

                    </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
        <button class="button btnPrimary" onClick={()=>navigateTo(`/edificios/${state}/unidades/${id}`)}><span class="btnText">Volver</span></button>
        </div>
        
    )
}