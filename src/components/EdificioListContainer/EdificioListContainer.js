import React from "react";
import { useState, useEffect } from "react";
import {EdificioList} from "../EdificioList/EdificioList"
import {useParams,Link} from "react-router-dom";
import { getToken } from "../../utils/auth-utils";
import { Mensaje } from "../Mensaje/Mensaje";
import {useNavigate} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";


export const EdificioListContainer = ({greeting}) =>{

    const [listaEdificios,setListaEdificios]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]=useState(null)
    const [rol,setRol]=useState(undefined);    
    const navigate=useNavigate()


    const ejecutarFetch = async() =>{


      let url=`${process.env.REACT_APP_DOMINIO_BACK}/admin/edificios`
      const response= await fetch(url, {
        method: "GET",
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
      }else{
        setListaEdificios(data)
        setMensaje(null)
      }
      }
    }
  
    const navigateTo=(url)=>{
      navigate(url)
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
      <h1 className="greeting">{greeting}</h1>
      <button class="button btnPrimary" onClick={()=>navigateTo(`/addEdificio`)}><span class="btnText">Agregar edificio</span></button>
      {!mensaje?(
      <div> 

        {loading ? <p>cargando...</p> : <EdificioList listaEdificios={listaEdificios}/>}
      </div>):<Mensaje msj={mensaje}/>}
      <button class="button btnPrimary" onClick={()=>navigateTo(`/`)}><span class="btnText">Volver</span></button>

      </>
    );
  }
  
