
import {Link, useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { getToken } from "../../utils/auth-utils";
import { Mensaje } from "../Mensaje/Mensaje";
import { UnidadResponsable } from "./UnidadResponsable";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";
import { ReclamoPost } from "../Reclamo/ReclamoPOST";
import imgUnidad from '../../img/unidad.png'
const Unidad =({fromReclamo,fromPerfil})=>{
    const {idRec,id}= useParams();
    const [unidad,setUnidad]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]=useState(null);
    const [updateResponsable,setUpdateResponsable]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const [add,setAdd]=useState(null);  
    const navigate=useNavigate()
    const actualLocation=window.location.href

    const navigateTo=(url)=>{
        navigate(url,{state:unidad.idEdificio})
    }
    const cambiarPropietario=()=>{
        setUpdateResponsable("propietario")
        return;
    }

    const cambiarInquilino=()=>{
        setUpdateResponsable("inquilino")
        return;
    }

    const generarReclamo= ()=>{
        setAdd(true)
    }

    const ejecutarFetch=async () =>{ 
    
        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/unidades/${id}`, {
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
                setUnidad(data)
            }
        }
    }



    const eliminar=async()=>{
        const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/admin/unidades/${id}`, {
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


    useEffect(() => { 
        ejecutarFetch()
        .catch(error => console.error(error))
        .finally(()=>{
          setLoading(false)
        })
      },[])


    return(
        <>
        {!updateResponsable?
            !add?
            !mensaje?
            <div className="tarjetaProducto">
                 <div className="imgContenedor"  > <img className = "imagenesCard" src={imgUnidad} alt="imgUnidad" /></div>
                <div>
                    <h1 id ="tituloGrande">Unidad N°{unidad.id}</h1>
                    <br />
                    <h2 id = "tituloMedio">Información</h2>
                    <h2>Nombre: {unidad.nombre}</h2>
                    <h2>Piso: {unidad.piso}</h2>
                    <h2>Numero: {unidad.numero}</h2>
                    <h2>Estado: {unidad.estado}</h2>
                    <br />
                    {unidad.propietario&&
                    <>
                        <h2 id="tituloMedio">Propietario:</h2>
                        <h2>DNI: {unidad.propietario.dni}</h2>
                        <h2>Nombre: {unidad.propietario.nombre}</h2>
                        <h2>Apellido: {unidad.propietario.apellido}</h2>
                    </>
                    }
                    <br />
                    {unidad.inquilino&&
                    <>
                    <h2 id="tituloMedio">Inquilino:</h2>
                        <h2>DNI: {unidad.inquilino.dni}</h2>
                        <h2>Nombre: {unidad.inquilino.nombre}</h2>
                        <h2>Apellido: {unidad.inquilino.apellido}</h2>
                    </>
                    }
                </div>
                {!fromReclamo&&<div className="button-view">
                    {fromPerfil||rol?<button onClick={()=>generarReclamo()} className="button btnPrimary"><span class="btnText">Generar reclamo</span></button>
                    :
                    <div>
                        <button class="button btnPrimary" onClick={()=>navigateTo(`/updateUnidad/${id}`)}><span class="btnText">Modificar</span></button>
                        <button onClick={()=>cambiarPropietario()}class="button btnPrimary"><span class="btnText">Cambiar propietario</span></button>
                        <button onClick={()=>cambiarInquilino()} class="button btnPrimary"><span class="btnText">Cambiar inquilino</span></button>
                        <button onClick={()=>eliminar()} class="button btnPrimary"><span class="btnText">Eliminar</span></button>
                    </div>
                }
                </div>
                }
            </div>
            :(<Mensaje msj={mensaje} />)
            :(<ReclamoPost isUnit={true} />)
            :<UnidadResponsable responsable={updateResponsable} />}

            {
            fromPerfil? <button class="button btnPrimary" onClick={()=>navigateTo(`/usuario/unidades`)}><span class="btnText">Volver</span></button>
            :
            !fromReclamo?
            <button class="button btnPrimary" onClick={()=>navigateTo(`/edificios/${unidad.idEdificio}/unidades`)}><span class="btnText">Volver</span></button>
            :
            rol?
            <button class="button btnPrimary" onClick={()=>navigateTo(`/usuario/reclamos/${idRec}`)}><span class="btnText">Volver</span></button>
            :
            <button class="button btnPrimary" onClick={()=>navigateTo(`/reclamos/${idRec}`)}><span class="btnText">Volver</span></button>
            }
        </>
    )
}

export {Unidad}