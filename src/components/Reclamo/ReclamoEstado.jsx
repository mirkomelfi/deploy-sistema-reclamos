import { useRef } from "react"
import { Mensaje } from "../Mensaje/Mensaje"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { getToken } from "../../utils/auth-utils"

import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";


export const ReclamoEstado = () => {

    const {id}= useParams();
    
    const [mensaje,setMensaje]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()

    const options = [
        {value: 1, text: 'Nuevo'},
        {value: 2, text: 'Abierto'},
        {value: 3, text: 'En proceso'},
        {value: 4, text: 'Anulado'},
        {value: 5, text: 'Desestimado'},
        {value: 6, text: 'Terminado'}
        ];
      
    const [estado, setEstado] = useState(options[0].value);
    
    const handleChange = event => {
        setEstado(event.target.value);
    };

    const navigateTo=(url)=>{
        navigate(url)
    }
    const datForm = useRef() //Crear una referencia para consultar los valoresa actuales del form

    const consultarForm = async(e) => {
        //Consultar los datos del formulario
        e.preventDefault()

        const datosFormulario = new FormData(datForm.current) //Pasar de HTML a Objeto Iterable
        const reclamo = Object.fromEntries(datosFormulario) //Pasar de objeto iterable a objeto simple
        console.log(reclamo)

        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/reclamos/${id}/estado/${estado}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: reclamo.medida
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
                
                <div  id="divForm" className="container" >
                    <h1>Cambio en el estado del Reclamo</h1>
                    <div>
                        <h3>Seleccione el nuevo estado del reclamo</h3>
                        <select id = "selectCambio" class="selectForm" value={estado} onChange={handleChange}>
                            {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                            ))}
                        </select>
                    </div>
                        <form onSubmit={consultarForm} ref={datForm}>

                            <div className="mb-3">
                                <label id = "textoCambioDeEstado" htmlFor="medida" className="form-label">Medida tomada</label>
                                <input type="text" className="form-control" name="medida" required/>
                            </div>

                            <button type="submit" className="button btnPrimary" >Actualizar</button>
                        </form>
                </div>
                ):    <Mensaje msj={mensaje} />
                    
        }
        </div>
        
    )
}