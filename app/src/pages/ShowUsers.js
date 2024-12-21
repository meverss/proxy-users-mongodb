/* eslint-disable no-unused-expressions */
/* eslint-disable no-eval */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../libs/axios.js'
import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CompPagination from '../components/CompPagination'
import { CompLoader } from '../components/CompLoader'
import CompNoAuth from './CompNoAuth.js'
import { serverContext } from '../App'
import exportPDF from "../libs/usersPDF.js"
import { formatDate  } from '../libs/formatDate.js'

import { BsFillPeopleFill, BsFillPersonCheckFill, BsTrash, BsFillPersonXFill } from 'react-icons/bs'
import { SlUserFollow, SlMagnifier, SlSettings } from "react-icons/sl"
import { ImFilePdf } from "react-icons/im"
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"
import { FaUserPlus } from "react-icons/fa"
import { FaUserPen  } from "react-icons/fa6"

const CompShowusers = ({ getname, notify }) => {
  const server = useContext(serverContext)
  const URI = `${server}/users/`

  const [users, setUsers] = useState([])
  const [admin, setAdmin] = useState(true)
  const [id, setId] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [active, setActive] = useState('')
  const [inactive, setInactive] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState()
  const [totalUsers, setTotalUsers] = useState()
  const [isdesktop, setIsDesktop] = useState(true)
  const [sortAsc, setSortAsc] = useState(true)
  const [sortArrow, setSortArrow] = useState()
  const [sortParam, setSortParam] = useState('Usuario')
  const [sortedUsers, setSortedUsers] = useState([])

  const navigate = useNavigate()

  const lastIndex = currentPage * usersPerPage
  const firstIndex = lastIndex - usersPerPage

  useEffect(() => {
    const verifyUser = async () => {
      const res = await axios.get(`${server}`)
      if (res.data.verified === true) {
        if (res.data.user !== 'admin') {
          setAdmin(false)
        }
        setId(res.data.id)
        getname(res.data.fullname)
        return
      } else {
        navigate('/login')
      }
    }  

    verifyUser()
    getUsers()
    searchShortCut()
  }, [])

 // Get users

  const getUsers = async () => {
    try {
      const res = await axios.get(URI)
      setUsers(res.data)
      setSortedUsers(res.data)
      setTotalUsers(res.data.length)
      setActive(res.data.filter(user => user.enabled === true).length)
      setInactive(res.data.filter(user => user.enabled === false).length)

      const msg = localStorage.getItem('msg')
      if(msg){
        msg.toLowerCase().includes('admin') ?
    	    notify('sys', msg)
        : null
      }
      
      localStorage.removeItem('msg')

    } catch (error) {
      console.log(error)
    }
  }

  // Search shortcut

  const searchShortCut = ()=>{
    let keysPressed = {}
    document.addEventListener('keydown', (event) => {
      keysPressed[event.key] = true

      if (keysPressed['Control'] && event.key === 'b') {
        alert(event.key)
      }
    })

    document.addEventListener('keyup', (event) => {
      delete keysPressed[event.key]
    })
  }
  

  // Check display size

  const checkDisplay = () => {
	const height = window.innerHeight
  	const movile = height < 768

  	const h = ()=>{
  	    if(height > 768 && height < 1024){
  		return 8
  	    } else if(height > 1024){
  		return 20
  	    }
  	}
   
	setUsersPerPage(movile ? 4 : h())
  }

  window.addEventListener('resize', () => {
    checkDisplay()
  })

  useEffect(() => {
    checkDisplay() 
  },[getUsers])


  // Filter users
  
  const filterUsers = async (filter) => {
    try {
      if (filter) {
	const res = await axios.get(URI)
	const data = res.data
	const foundUsers = data.filter(user => user.user.toLowerCase().includes(filter.toLowerCase()) || user.fullname.toLowerCase().includes(filter.toLowerCase()))
	if(foundUsers.length >= 1){
    	    setSortedUsers(foundUsers)
	    setTotalUsers(foundUsers.length)
	    setActive(foundUsers.filter(user => user.enabled === true).length)
	    setInactive(foundUsers.filter(user => user.enabled === false).length)
    	    setCurrentPage(1)
	}
      } else {
        getUsers()
      }

    } catch (error) {
      notify('err', <p>{error.response.data.message}</p>)
    }
  }
  
  // Sort users
  
  const sort = (e) => {
    const param = ((e.target.innerHTML).split(' '))[0]
    setSortParam(param)
    let prm = ''
    
    switch (param) {
      case 'Usuario':
        prm = 'user'
        break
      case 'Nombre':
        prm = 'fullname'
        break
      case 'Creado':
        prm = 'createdAt'
        break
      case 'Modificado':
        prm = 'updatedAt'
        break
      default:
        prm = 'user'
    }

    setSortedUsers(users.toSorted((a, b) => {
      const sortDAta = `!sortAsc ? a.${prm}.localeCompare(b.${prm}) : b.${prm}.localeCompare(a.${prm})`
      return eval(sortDAta)
    }))

    setSortAsc(prev => !prev)
  }

  useEffect(() => {
    !sortAsc ? setSortArrow(<TiArrowSortedUp color='#555' />) : setSortArrow(<TiArrowSortedDown color='#555' />)
  }, [sortAsc])

 // Delete user
 
  const deleteuser = async (id) => {
    await axios.delete(URI + id)
    notify('ok', <p>Usuario eliminado</p>)
    getUsers()

  }

  // Export PDF

  const showExpPDF = ()=>{
  	const pdfMain = document.getElementById('pdfMain')
  	const pdfBox = document.getElementById('pdfBox')

	pdfMain.style['display'] = 'flex'
	pdfBox.classList.remove("animate__animated", "animate__bounceOut")
	pdfBox.classList.add('animate__animated', 'animate__bounceIn')
  	
  }

  const hideExpPDF = ()=>{
  	const pdfMain = document.getElementById('pdfMain')
  	const pdfBox = document.getElementById('pdfBox')
  	
	pdfBox.classList.remove("animate__animated", "animate__bounceIn")
	pdfBox.classList.add("animate__animated", "animate__bounceOut")

	setTimeout(()=>{
  		pdfMain.style['display'] = 'none'
	},700)
  }

  const expPDF = (opt)=>{
  	exportPDF(users, opt)
  }

  return (
    <>
      {
        admin ?
          totalUsers > 0 ?
            <>
              <div className='container'>
                <div className='row'>
                  <div className='col'>
                    <section className='mainTools'>
                      <h1 className='sessionTitle fw-bold mb-3'>Listado de usuarios</h1>
                      <div className='input-group mb-3 searchBar '>
                        <span className='input-group-text ' id='search'><SlMagnifier /></span>
                        <input
                          className='form-control'
                          onChange={(e) => filterUsers(e.target.value)}
                          type='text'
                        />
                      </div>
                      <div className='gap-2 d-md-flex justify-content-md-center btn-tools-group'>
                        <Link to='/new' className='new-record btn btn-outline-success me-md-2 shadow-sm border-dark-subtle btn-tool' style={{ borderRadius: '8px' }}> <FaUserPlus size='22px' /> {isdesktop ? 'Nuevo' : null}</Link>

                        <button onClick={()=>showExpPDF()} className='new-record btn btn-outline-success me-md-2 shadow-sm border-dark-subtle btn-tool' style={{ borderRadius: '8px' }}> <ImFilePdf size='22px' color='#D7113E' /> {isdesktop ? 'Exportar' : null}</button> 

                      </div>
                    </section>
                    <div className='usersTable shadow-sm p-3 mb-5 ' id='usersTable' onLoad={()=> checkDisplay()}>
                      <table className='table table-responsive table-sm table-hover' id='usrtable'>
                        <thead className='table' style={{ backgroundColor: '#000' }}>
                          <tr>
                            <th><span className='header' onClick={sort}>Usuario {sortParam === 'Usuario' ? sortArrow : null}</span></th>
                            <th><span className='header' onClick={sort}>Nombre y apellidos {sortParam === 'Nombre' ? sortArrow : null}</span></th>
                            <th><span className='header' onClick={sort}>Creado {sortParam === 'Creado' ? sortArrow : null}</span></th>
                            <th><span className='header' onClick={sort}>Modificado {sortParam === 'Modificado' ? sortArrow : null}</span></th>
                            <th><span className='header' >Estado</span></th>
                            <th><span className='header' >Acciones</span></th>
                          </tr>
                        </thead>
                        <tbody className='tableBody'>
                          {sortedUsers.map((user) => (
                            <tr key={user.id} className='table-sm'>
                              <td><p id='admUser'> {user.user}</p> </td>
                              <td><p> {user.fullname}</p> </td>
                              <td><p> {formatDate(user.createdAt)}</p> </td>
                              <td><p> {formatDate(user.updatedAt)} </p></td>
                              <td> <p>{user.enabled === true ? <span style={{ color: '#36956A' }}>Activo</span> : <span style={{ color: '#D3691F' }}>Inactivo</span>} </p></td>
                              <td className='actions'>
                                <Link to={`/edit/${user.id}`} className='btn btn-sm ' id='editIcon'><FaUserPen className='actionIcon' size='26px' /></Link>
                                <button className='btn btn-sm' id='deleteIcon' data-bs-toggle="modal" data-bs-target="#deleteModal"
                                  onClick={user.user === 'admin' ? () => console.log(`Can't delete admin account`) : () => {
                                    setSelectedId(user.id); setSelectedUser(user.user)
                                  }} disabled={user.user === 'admin' ? true : false}  ><BsTrash className='actionIcon' size='24px' /></button>
                              </td>
                            </tr>
                          )).slice(firstIndex, lastIndex)}
                        </tbody>
                      </table>
                    </div>
                    <CompPagination
                      usersPerPage={usersPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalUsers={totalUsers}
                    />
                  </div>
                </div>
              </div>

              {/* Delete user Modal */}
              <div className="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="true" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">Eliminar usuario</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p>¿Seguro que desea borrar el usuario <b>{selectedUser}</b>?</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteuser(selectedId)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
              <div id='pdfMain' className='pdfMain' onClick={()=>hideExpPDF()}>
		<div id='pdfBox' className='pdfBox'>
		    <div className='pdfOpt' onClick={()=>expPDF('t')}>
			<ImFilePdf className='pdfImage' size='45' />
			<p className='pdfText'>Total</p>
		    </div>
		    <div className='pdfOpt' onClick={()=>expPDF('a')}>
			<ImFilePdf className='pdfImage' size='45' />
			<p className='pdfText'>Activos</p>
		    </div>
		    <div className='pdfOpt' onClick={()=>expPDF('i')}>
			<ImFilePdf className='pdfImage' size='45' />
			<p className='pdfText'>Inactivos</p>
		    </div>
		</div>
              </div>
              <div className='footer'>
                <p><BsFillPeopleFill /> Total: {totalUsers}</p>
                <p><BsFillPersonCheckFill /> Activos: {active}</p>
                <p><BsFillPersonXFill /> Inactivos: {inactive}</p>
              </div>
            </>
          : <CompLoader />
          : <CompNoAuth />
      }
    </>
  )
}

export default CompShowusers
