export const CompLoader = () => {
  const timestamp = Date.now()
  const today = new Date(timestamp)
  const currentYear = today.getFullYear()

  return (
    <>
      <div className="loaderContainer">
        <div className='loaderContainer'>
          <span className="loader"></span>
        </div>
      </div>
      <div className='footer1'>
        <p>Powered by KiniunDev - Copyright© {currentYear}</p>
      </div>
    </>
  )
}