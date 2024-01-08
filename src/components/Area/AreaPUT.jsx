import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";

export const AreaPut = () => {

    const {id}= useParams();

    const [mensaje,setMensaje]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    const {state}=useLocation();
    const navigateTo=(url)=>{
        navigate(url)
    }
    const datForm = useRef() //Crear una referencia para consultar los valoresa actuales del form

    const consultarForm = async(e) => {
        //Consultar los datos del formulario
        e.preventDefault()

        const datosFormulario = new FormData(datForm.current) //Pasar de HTML a Objeto Iterable
        const area = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        if (area.piso==""){area.piso=null;}
        if (area.descripcion==""){area.descripcion=null;}
        if (area.nombre==""){area.nombre=null;}
        if (!area.piso&&!area.descripcion&&!area.nombre){ setMensaje("No se ingresaron valores para actualizar")}
        else{
            const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/areas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(area)
            })

            const rol=validateRol(response)
            if (!rol){
              if (isRolUser(getToken())){
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
                    <h2>Cambio en los datos del Area</h2>
                    <h3>Ingrese solo los campos que desea modificar</h3>
                    <form onSubmit={consultarForm} ref={datForm}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="piso" className="form-label">Piso</label>
                            <input type="number" className="form-control" name="piso" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripcion</label>
                            <input type="text" className="form-control" name="descripcion" />
                        </div>

                        <button type="submit"  class="button btnPrimary">Actualizar</button>
                        </form>

                    </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
        <button class="button btnPrimary" onClick={()=>navigateTo(`/edificios/${state}/areas/${id}`)}><span class="btnText">Volver</span></button>

        </div>
        
    )
}