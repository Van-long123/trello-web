import '~/assets/css/loading/loading.css'

function PageLoadingSpinner({ caption }) {
  return (
    <>
      <div className="main">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>

        <div className="loading-container">
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>

          <div className="loading-text">
            {caption}<span className="loading-dots"></span>
          </div>

          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>

    </>
  )
}

export default PageLoadingSpinner
