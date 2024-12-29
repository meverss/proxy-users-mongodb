/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../libs/axios.js'
import { useEffect, useState, useContext, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverContext } from '../App.js'
import { CompLoader } from '../components/CompLoader.js'
import { useVerify } from '../hooks/useVerify.js'

const CompTest = ({ getname, notify }) => {

  const server = useContext(serverContext)
  const URI = `${server}/`

  return (
    <>
        <div className=''>
      	<h1>Here goes the title</h1>
      	  <p>
      		Esto es una prueba
      	  </p>
      	  <button>Enviar</button>
        </div>
      }
    </>
  )
}

export default CompTest
