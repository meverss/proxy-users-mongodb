import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './App.css'
import { React, useState, useEffect, createContext } from 'react'
import { FaCircleCheck, FaTriangleExclamation, FaCircleExclamation } from "react-icons/fa6";
import { IoSunnyOutline, IoLogOutOutline } from "react-icons/io5"
import { RiMoonLine } from "react-icons/ri"
import { PiGearFill } from "react-icons/pi"
import bgLight from "./images/background_app.webp"
import bgDark from "./images/background_app_dark.jpg"
import { getYear } from './libs/formatDate.js'

// Import router
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// Import Components
import CompShowUsers from './pages/ShowUsers.js'
import CompCreateUser from './pages/CreateUser.js'
import CompEditUser from './pages/EditUser.js'
import CompLogin from './pages/CompLogin.js'
import CompPageNotFound from './pages/CompPageNotFound.js'
import CompNoAuth from './pages/CompNoAuth.js'

// Set backend server
export const serverContext = createContext()
//const server = `http://${window.location.hostname}:4000/api`
const server = 'https://proxyusers-server.vercel.app/api'

// App Component
const App = () => {
  const [user, setUser] = useState('')
  const [id, setId] = useState('')
  const [notifyIcon, setNotifyIcon] = useState('')
  const [notifyText, setNotifyText] = useState('')
  const [theme, setTheme] = useState('')
  const [themeIcon, setThemeIcon] = useState('')
  const [loginMsg, setLoginMsg] = useState('')

  useEffect(() => {
    getId()
    getTheme()
  }, [])

  const getName = (name) => {
    setUser(name)
  }
  
  const getId = (id) => {
      setId(id)
  }

  // Theme switch (Light/Dark)
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)')

  systemTheme.addEventListener('change', () => {
  	localStorage.removeItem('Theme')
  	getTheme()
  })

  const getTheme = () => {
  	const dark = <IoSunnyOutline className='themeSwitch menuIcon animate__animated animate__bounceIn' size='28px' />
  	const light = <RiMoonLine className='themeSwitch menuIcon animate__animated animate__bounceIn' size='28px' />
  	const userTheme = localStorage.getItem('Theme')
  	
    if(!userTheme){
		if(systemTheme.matches){
			setTheme('light')
			setThemeIcon(light)	
		} else {
			setTheme('dark')
			setThemeIcon(dark)
		}   	
    } else {
    	setTheme(userTheme)
    	setThemeIcon(eval(userTheme))
    }
  }

  const changeThemeUser = () => {
    if(theme === 'light'){
		localStorage.setItem('Theme','dark')
		getTheme()
    } else {
		localStorage.setItem('Theme','light')
		getTheme()
    }
  }

  // LogOut
  const logOut = async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('Theme')
      window.location.pathname = '/login'
    } catch (error) {
      console.log(error)
    }
  }
  
  // Notification Box
  const showNotification = (notiType, message) => {
    const noti = document.getElementById('s_notifications')

    switch (notiType) {
      case "ok":
        setNotifyIcon(
          <div id="ntf_icon" className="ntf_icon">
            <FaCircleCheck style={{ color: 'green' }} />
          </div>
        )
        break
      case "err":
        setNotifyIcon(
          <div id="ntf_icon" className="ntf_icon" >
            <FaTriangleExclamation style={{ color: 'red' }} />
          </div>
        )
        break
      case "inf":
        setNotifyIcon(
          <div id="ntf_icon" className="ntf_icon">
            <FaCircleExclamation style={{ color: 'yellow' }} />
          </div>
        )
        break
      case "sys":
        setNotifyIcon(
          <div id="ntf_icon" className="ntf_icon spinn">
            <PiGearFill style={{ color: 'chocolate' }} />
          </div>
        )
        break
      default:
    }

    setNotifyText(message)
    noti.style['transform'] = 'translate(-3%)'
    setTimeout(() => {
      noti.style['transform'] = 'translate(102%)'
    }, 2500)

  }
  
  return (
    <serverContext.Provider value={server}>
      <>
        <div id='appDiv' data-theme={theme} data-bs-theme={theme} >
          <div className='App' style={{
             backgroundImage: `url(${theme === 'light' ? bgLight : bgDark})`,
             backgroundRepeat: 'no-repeat',
             backgroundSize: 'cover',
             backgroundPosition: 'top',
             backgroundAttachment: 'fixed',
           }}>
            <nav className="navbar">
              <div className="container-fluid">
                <div className='Title'>
                  <p className="App-Title "><span className='text fw-bold mb-2 text-uppercase'>Usuarios del proxy</span></p>
                </div>
                <div className="sessionInfo d-inline-flex" id='logOut'>
                  	<span className='session userName' id='userName'>{user}</span>
                    < button className="session btn" id='themeSwitch' type="button" onClick={changeThemeUser}>{themeIcon}</button>
                    < button className="session btn" id='logOut' hidden={user !== '' ? false : true} type="button" onClick={logOut} ><IoLogOutOutline className='logOut menuIcon animate__animated animate__bounceIn' size='26px'  /></button>
                </div>
              </div>
            </nav >

            {/* Notification */}
            <section className="s_notifications" id="s_notifications">
              <div className="ntf_box" id="ntf_box">
                <div className="ntf_msg" id="ntf_msg">
                  <div className="ntf_icon">{notifyIcon}</div>
                  <div className="ntf_text">
                    {notifyText}
                  </div>
                </div>
              </div>
            </section>
            <br />
            
            <BrowserRouter forceRefresh={true}>
              <Routes>
                <Route path='/' element={<CompShowUsers
                  getname={getName} notify={showNotification} />} />
                <Route path='/login' element={<CompLogin />} />
                <Route path='/new' element={<CompCreateUser getname={getName} notify={showNotification} />} />
                <Route path='/edit/:id' element={<CompEditUser getname={getName} notify={showNotification} />} />
                <Route path='/noauth' element={<CompNoAuth getId={getId} />} />
                <Route path='/error' element={<CompPageNotFound getname={getName} />} />
                <Route path='*' element={<Navigate to="/error" />} />

              </Routes>
            </BrowserRouter>

          </div>
        </div >
        <div className='footer1'>
          <p>Powered by KiniunDev™ - Copyright© {getYear()}</p>
        </div>
      </>
    </serverContext.Provider>
  )
}

export default App
