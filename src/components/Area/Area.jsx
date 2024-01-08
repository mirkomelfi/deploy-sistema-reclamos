import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { getToken } from "../../utils/auth-utils";
import { Mensaje } from "../Mensaje/Mensaje";
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";
import { ReclamoPost } from "../Reclamo/ReclamoPOST";
import imgArea from '../../img/area.png'
const Area =({fromReclamo,fromPerfil})=>{
    const {idRec,id}= useParams();

    const [area,setArea]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]=useState(null)
    const [add,setAdd]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    const navigateTo=(url)=>{
      navigate(url,{state:area.idEdificio})
    }

    const generarReclamo= ()=>{
      setAdd(true)
  }
    
    const eliminar=async()=>{
      const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/areas/${id}`, {
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

  }


  const ejecutarFetch=async () =>{ 
    
    const response= await  fetch(`${process.env.REACT_APP_DOMINIO_BACK}/areas/${id}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
          
      }
      
    })
    
    const rol=validateRol(response)
    if (!rol){
        deleteToken()
        navigate("/login")
        
    }else{
        const data = await response.json()
        setRol(isRolUser(getToken()))
        if(data.msj){
            setMensaje(data.msj)
        }else{
          setArea(data)
        }
    }
}

useEffect(() => { 
  ejecutarFetch()
  .catch(error => console.error(error))
  .finally(()=>{
    setLoading(false)
  })
},[])

    return(
        <>
        {
         !add?
         !mensaje?
            <div className="tarjetaProducto">
               <div className="imgContenedor"  > <img className = "imagenesCard" src={imgArea} alt="imgReclamo" /></div>
              <div>
                <h1 id ="tituloGrande">Area N°{area.id}</h1>
                <h2>Nombre: {area.nombre}</h2>
                <h2>Piso: {area.piso}</h2>
                <h2>Descripcion: {area.descripcion}</h2>
              </div>

             {!fromReclamo&&<div className="button-view">
                {fromPerfil||rol?<button onClick={()=>generarReclamo()} className="button btnPrimary"><span class="btnText">Generar reclamo</span></button>
                :
                <div>
                  <button class="button btnPrimary" onClick={()=>navigateTo(`/updateArea/${id}`)}><span class="btnText">Modificar</span></button>
                  <button onClick={()=>eliminar()} className="button btnPrimary"><span class="btnText">Eliminar</span></button>
                </div>
                }
              </div>}

            </div>
                 
                :(<Mensaje msj={mensaje} />)
          :
          (<ReclamoPost isUnit={false} />)
      }
            {
            fromPerfil? <button class="button btnPrimary" onClick={()=>navigateTo(`/usuario/areas`)}><span class="btnText">Volver</span></button>
            :
            !fromReclamo?<button class="button btnPrimary" onClick={()=>navigateTo(`/edificios/${area.idEdificio}/areas`)}><span class="btnText">Volver</span></button>
            :
            rol?
            <button class="button btnPrimary" onClick={()=>navigateTo(`/usuario/reclamos/${idRec}`)}><span class="btnText">Volver</span></button>
            :
            <button class="button btnPrimary" onClick={()=>navigateTo(`/reclamos/${idRec}`)}><span class="btnText">Volver</span></button>

            }
        </>
    )
}

export {Area}