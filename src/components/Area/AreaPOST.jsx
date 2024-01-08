import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";

export const AreaPost = () => {

    const {id}= useParams();
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
        const area = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple

        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/edificios/${id}/addArea`, {
            method: "POST",
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
        

    return (

        <div>
            {!mensaje?(
                
                <div id="divForm" className="container">
                    <h2>Creacion de Area Comun</h2>
                    <form onSubmit={consultarForm} ref={datForm}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="piso" className="form-label">Piso</label>
                            <input type="number" className="form-control" name="piso" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <input type="text" className="form-control" name="descripcion" required/>
                        </div>

                        <button type="submit"  class="button btnPrimary">Crear</button>
                        </form>

                    </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
        </div>
        
    )
}