
import {Link} from "react-router-dom";
import { useState } from "react";
import { getToken } from "../../utils/auth-utils";
import { Mensaje } from "../Mensaje/Mensaje";
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";
import imgEdificio from '../../img/edificio.png'
const Edificio =({edificio})=>{
    const [mensaje,setMensaje]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    const navigateTo=(url)=>{
        navigate(url)
    }

    const modificar=async()=>{

    }

    const eliminar=async()=>{
        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/edificios/${edificio.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
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
        return;
    }

    return(
        <>
        {!mensaje?
            <div className="tarjetaProducto">
                <div className="imgContenedor" > <img className = "imagenesCard" src={imgEdificio} alt="imgEdificio" /></div>
                <div>
                    <h1 id ="tituloGrande">Edificio N°{edificio.id}</h1>
                    <h2>Calle: {edificio.calle}</h2>
                    <h2>Numero: {edificio.numero}</h2>
                    <h2>Ciudad: {edificio.ciudad}</h2>
                    <h2>Codigo postal: {edificio.codigoPostal}</h2>
                </div>
                <div class="button-view">
                    <button class="button btnPrimary" onClick={()=>navigateTo(`${edificio.id}/unidades`)}><span class="btnText">Ver unidades</span></button>
                    <button class="button btnPrimary" onClick={()=>navigateTo(`${edificio.id}/areas`)}><span class="btnText">Ver areas</span></button>
                    <button class="button btnPrimary" onClick={()=>navigateTo(`/updateEdificio/${edificio.id}`)}><span class="btnText">Modificar</span></button>
                    <button onClick={()=>eliminar()}  class="button btnPrimary"><span class="btnText">Eliminar</span></button>
                </div>
               
            </div>
            
            :(<Mensaje msj={mensaje} />)}
            
        </>
    )
}

export {Edificio}