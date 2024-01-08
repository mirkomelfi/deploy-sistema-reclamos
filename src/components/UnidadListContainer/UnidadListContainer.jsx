import React from "react";
import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { UnidadList } from "../UnidadList/UnidadList";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth-utils";
import { UnidadPost } from "../Unidad/UnidadPOST";
import { Mensaje } from "../Mensaje/Mensaje";

import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";


const UnidadListContainer = ({greeting}) =>{

    const {id}= useParams();

    const [listaUnidades,setListaUnidades]= useState([]);
    const [loading,setLoading]= useState(true);
    const [add,setAdd]= useState(undefined);
    const [mensaje,setMensaje]= useState(null);
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    const navigateTo=(url)=>{
        navigate(url)
    }

    const agregar= () =>{ 
      setAdd(true)
    }

    const ejecutarFetch=async () =>{ 
    
      const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/edificios/${id}`, {
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
            const unidades= data.unidades
            if (unidades.length==0){
              setMensaje("No se encontraron unidades para este edificio")
            }else{
              setListaUnidades(unidades)
            }
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

  

    return (

      <>
      {!add ?
  <>
      <h1 className="greeting">{greeting}</h1>
      <button onClick={()=>agregar()} className="button btnPrimary"><span class="btnText">Agregar Unidad</span></button>
      {!mensaje?(
      <div> 

        {loading ? <p>cargando...</p> : <UnidadList pid={id} listaUnidades={listaUnidades} isAdmin={true}/>}
      </div>):<Mensaje msj={mensaje}/>}

      </>:
      <UnidadPost/>}
       <button class="button btnPrimary" onClick={()=>navigateTo(`/edificios`)}><span class="btnText">Volver</span></button>
      </>
    );
  } 
  
export default UnidadListContainer;