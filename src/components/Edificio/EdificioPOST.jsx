import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";

export const EdificioPost = () => {

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
        const direccion = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/edificios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(direccion)
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
                
                <div id="divForm" className="container" >
                    <h2>Creacion de Edificio</h2>
                    <form onSubmit={consultarForm} ref={datForm}>
                        <div className="mb-3">
                            <label htmlFor="calle" className="form-label">Calle</label>
                            <input type="text" className="form-control" name="calle" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="numero" className="form-label">Numero</label>
                            <input type="number" className="form-control" name="numero" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ciudad" className="form-label">Ciudad</label>
                            <input type="text" className="form-control" name="ciudad" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codigoPostal" className="form-label">Codigo Postal</label>
                            <input type="number" className="form-control" name="codigoPostal" required/>
                        </div>

                        <button type="submit"  class="button btnPrimary">Crear</button>
                        </form>

                    </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
         <button class="button btnPrimary" onClick={()=>navigateTo(`/edificios`)}><span class="btnText">Volver</span></button>

        </div>
        
    )
}