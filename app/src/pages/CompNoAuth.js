import axios from '../libs/axios.js'
import { useState, useEffect, useContext } from 'react'
import unauthorized from '../images/403.webp'
import { serverContext } from '../App.js'

const CompNoAuth = () => {
    const [admin, setAdmin] = useState(false)
    const [id, setId] = useState('')
    
    const server = useContext(serverContext) 

    useEffect(()=>{
	const verifyUser = async () => {
	    const res = await axios.get(`${server}`)
	    if (res.data.verified === true) {
		if (res.data.user === 'admin') {
		    setAdmin(true)
		}
		setId(res.data.id)
	    }
	}
	
	verifyUser()
    },[])
    
    return (
    <>
	<div className='unauthCont' hidden={admin ? true : false} >
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
