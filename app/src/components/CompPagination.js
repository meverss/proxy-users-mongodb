/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { TfiControlSkipBackward, TfiControlSkipForward, TfiControlBackward, TfiControlForward } from "react-icons/tfi"

const CompPagination = ({ usersPerPage, currentPage, setCurrentPage, totalUsers }) => {

  const Pages = []
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    Pages.push(i)
  }

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const previusPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }
  const nextPage = () => {
    if (currentPage !== Pages.length) setCurrentPage(currentPage + 1)
  }
  const firstPage = () => {
    setCurrentPage(1)
  }
  const lastPage = () => {
    setCurrentPage(Pages.length)
  }
  
  window.addEventListener('resize', ()=>{
  	goToPage(1)
  })

  return (
    <nav className='paginationBar is-rounded'>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" onClick={firstPage}><TfiControlSkipBackward size={18} /></a>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" onClick={previusPage}><TfiControlBackward size={18} /></a>
        </li>
        {Pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`} onClick={() => goToPage(page)}><a className="page-link" >{page}</a></li>
        ))
        }
        <li className={`page-item ${currentPage === Pages.length ? 'disabled' : ''}`}>
          <a className="page-link" onClick={nextPage}><TfiControlForward size={18} /></a>
        </li>
        <li className={`page-item ${currentPage === Pages.length ? 'disabled' : ''}`}>
          <a className="page-link" onClick={lastPage}><TfiControlSkipForward size={18} /></a>
        </li>
      </ul>
    </nav>
  )
}

export default CompPagination
