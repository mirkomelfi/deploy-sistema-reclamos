import React from "react";
import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { AreaList } from "../AreaList/AreaList";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth-utils";
import { AreaPost } from "../Area/AreaPOST";
import { Mensaje } from "../Mensaje/Mensaje";

import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";


const UserAreaListContainer = ({greeting}) =>{

    const [listaAreas,setListaAreas]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]= useState(null);
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()
    const navigateTo=(url)=>{
        navigate(url)
    }

    const ejecutarFetch=async () =>{ 
    
      const response= await fetch(`${process.env.REACT_APP_DOMINIO_BACK}/misAreas`, {
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
            setListaAreas(data)
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
          {loading 
          ? 
          <p>Cargando...</p> 
          : (!mensaje?
         (
          <>
            <h1 className="greeting">{greeting}</h1>
            <AreaList listaAreas={listaAreas}/>
          </>):<Mensaje msj={mensaje}/>)
          }
          <button class="button btnPrimary" onClick={()=>navigateTo(`/`)}><span class="btnText">Volver</span></button>
          
        </>
    );
  } 
  
export default UserAreaListContainer;