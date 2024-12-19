import { useState,useEffect } from 'react'
import unauthorized from '../images/403.webp'

const CompNoAuth = ({admin, id}) => {
    const [isHidden, setIsHidden] = useState(true)
    
    useEffect(()=>{
	checkAdmin()
    },[])
    
    const checkAdmin = ()=>{
	if(!admin){
	    setIsHidden(false)
	}
    }
    return (
    <>
	<div className='unauthCont' hidden={isHidden} >
     	    <a href={`/edit/${id}`} ><img className='unauthImage animate__animated animate__fadeIn' src={unauthorized} alt='Unathorized'></img></a>
     		<span className='noAccessText' style={{
     		    fontSize: window.innerWidth <= 420 ? '20px' : '36px',
     		    fontWeight: 'bold'
     		    }}>
     		    <p>ACCESO RESTRINGIDO</p>
     		</span>
	</div>
     </>
    )
}

export default CompNoAuth
