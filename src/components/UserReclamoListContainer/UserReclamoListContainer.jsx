import React from "react";
import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { ReclamoList } from "../ReclamoList/ReclamoList";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth-utils";
import { ReclamoPost } from "../Reclamo/ReclamoPOST";
import { Mensaje } from "../Mensaje/Mensaje";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";


const UserReclamoListContainer = ({greeting}) =>{

    const [listaReclamos,setListaReclamos]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]= useState(null);
    const [rol,setRol]=useState(undefined);   
    let url=""; 
    const navigate=useNavigate()

    const navigateTo=(url)=>{
        navigate(url)
    }

    const options = [
      {value: 0, text: 'Mostrar todos'},
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

    const ejecutarFetch=async () =>{ 
      if (estado!=0){

        url=`${process.env.REACT_APP_DOMINIO_BACK}/misReclamos/filter?estado=${estado}`
      }else{
        url=`${process.env.REACT_APP_DOMINIO_BACK}/misReclamos`
      }
      const response= await fetch(url, {
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
            setListaReclamos(data)
          }
      }
  }

  useEffect(() => { 
    ejecutarFetch()
    .catch(error => console.error(error))
    .finally(()=>{
      setLoading(false)
    })
  },[estado])


  
    return (
        <> 
          {loading 
          ? 
          <p>Cargando...</p> 
          : (!mensaje?
         (
          <>
            
            <h1 className="greeting">{greeting}</h1>
            <div>
                  <select className= "selectForm" value={estado} onChange={handleChange}>
                      {options.map(option => (
                      <option key={option.value} value={option.value}>
                          {option.text}
                      </option>
                      ))}
                  </select>
            </div>
            <ReclamoList listaReclamos={listaReclamos}/>
          </>):<Mensaje msj={mensaje}/>)
          }
        <button class="button btnPrimary" onClick={()=>navigateTo(`/`)}><span class="btnText">Volver</span></button>
         
        </>
    );
  } 
  
export default UserReclamoListContainer;