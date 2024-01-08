import React from "react";
import { useState, useEffect } from "react";
import {ReclamoList} from "../ReclamoList/ReclamoList"
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth-utils";
import { Mensaje } from "../Mensaje/Mensaje";
import {useNavigate, useParams} from "react-router-dom";
import { validateRol,isRolUser,deleteToken } from "../../utils/auth-utils";

export const ReclamoListContainer = ({greeting}) =>{

    const [listaReclamos,setListaReclamos]= useState([]);
    const [loading,setLoading]= useState(true);
    const [mensaje,setMensaje]=useState(null)
    let url="";
    
    const navigate= useNavigate()


      const [reclamos,setReclamos]= useState(null);

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

    const ejecutarFetch = async() =>{
      if (estado!=0){
        url=`${process.env.REACT_APP_DOMINIO_BACK}/admin/reclamos/filter?estado=${estado}`
      }else{
        url=`${process.env.REACT_APP_DOMINIO_BACK}/admin/reclamos`
      }


      const response= await  fetch(url, {
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
        if (data.length!=0){
          setListaReclamos(data)
        setMensaje(null)
        }else{
          
        setMensaje("No hay reclamos con dicho estado")
        }
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
    },[estado])



    

    return (

      <>
      <h1 className="greeting">{greeting}</h1>
      <div>
            <select class="selectForm" value={estado} onChange={handleChange}>
                {options.map(option => (
                <option class="option-dropdown" key={option.value} value={option.value}>
                    {option.text}
                </option>
                ))}
            </select>
      </div>
      {!mensaje?
      <>
    

      <div>
        {loading ? <p>cargando...</p> : <ReclamoList listaReclamos={listaReclamos}/>}
      </div> </>
      :<Mensaje msj={mensaje}/>}
      <button class="button btnPrimary" onClick={()=>navigateTo(`/`)}><span class="btnText">Volver</span></button>

      
    </>
    );
  }