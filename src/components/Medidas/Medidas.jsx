const Medidas = ({medidas})=>{

    return (
        <>
        {medidas&&
            <div className="tarjetaListado">
                {medidas.map(medida => <h2>{medida}</h2>)}
            </div>
        }
        </>

    )
}
export  {Medidas}