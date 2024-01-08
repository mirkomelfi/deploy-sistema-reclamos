import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"


import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";

export const UnidadPost = () => {

    const {id}= useParams();
console.log(id)
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

        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/edificios/${id}/addUnit`, {
            method: "POST",
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
        

    return (

        <div>
            {!mensaje?(
                
                <div id="divForm" className="container" >
                    <h2>Creacion de Unidad</h2>
                    <form onSubmit={consultarForm} ref={datForm}>
                        <div className="mb-3">
                            <label htmlFor="piso" className="form-label">Piso</label>
                            <input type="number" className="form-control" name="piso" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="numero" className="form-label">Numero</label>
                            <input type="number" className="form-control" name="numero" required/>
                        </div>

                        <button type="submit" className="btn btn-primary">Crear</button>
                        </form>

                    </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
        </div>
        
    )
}