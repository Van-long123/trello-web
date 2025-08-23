import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createNewBoardApi } from '~/apis'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import '~/assets/board/style.css'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'

function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState(null)
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    setSelectedBackground(null)
    // Reset lại toàn bộ form khi đóng Modal
    reset()
  }

  const handleImageUpload = (e) => {
    const file=e.target.files[0]
    if (file) {
      setSelectedBackground(URL.createObjectURL(file))
      // Gọi lại onChange mặc định của react-hook-form để cập nhật value
      register('backgroundImage').onChange(e)
    }
  }

  const submitCreateNewBoard = (data) => {
    const error = singleFileValidator(data.backgroundImage[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('background', data.backgroundImage[0])
    reqData.append('title', data.title)
    reqData.append('description', data.description)
    reqData.append('type', data.isPrivate ? 'private' : 'public')
    toast.promise(
      createNewBoardApi(reqData),
      {
        pending: 'Updating...'
      }
    ).then((res) => {
      if (!res.error) {
        handleCloseModal()
        // Gọi đến component cha để xử lý
        afterCreateNewBoard()
        toast.success('Board created successfully')
      }
    })

  }


  const SidebarItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    backgroundColor: theme.palette.mode === 'dark' ? '#23262bff' : '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#383c43ff' : theme.palette.grey[300]
    },
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
    }
  }))

  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>
      <div id="createBoardModal" className={`${!isOpen ? 'hidden' :''} modal-overlay`}>
        <div className='modal glass-morphism'>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create a new board</h3>
              <button
                onClick={handleCloseModal}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(submitCreateNewBoard)}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="Enter board name..."
                  className="form-input glass-morphism"
                  {...register('title', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 50, message: 'Max Length is 50 characters' }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'title'} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Short description of the board..."
                  rows="3"
                  className="form-textarea glass-morphism"
                  {...register('description', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 255, message: 'Max Length is 255 characters' }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'description'} />
              </div>

              <div className="form-group">
                <label className="form-label">Background image</label>
                <div className="background-section">
                  {/* Upload from computer option */}
                  <div className="upload-section">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      style={{ display: 'none' }}
                      {...register('backgroundImage', {
                        required: 'Background image is required',
                        validate: {
                          isFileChosen: (files) =>
                            files && files.length > 0 || 'You must select an image'
                        }
                      })}
                      onChange={handleImageUpload}
                    />
                    <button
                      type="button"
                      className="upload-btn glass-morphism"
                      onClick={() =>
                        document.getElementById('imageUpload').click()
                      }
                    >
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">Select photo from device</span>
                    </button>
                    <FieldErrorAlert errors={errors} fieldName={'backgroundImage'} />
                  </div>
                </div>
              </div>
              {selectedBackground &&
              <div className="background-option">
                <img className="background-image" src={selectedBackground} />
              </div>
              }
              <div className="form-group">
                <label className="form-label">Privacy</label>
                <div className="privacy-toggle">
                  <label className="ios-switch">
                    <input type="checkbox" id="privateToggle" {...register('isPrivate')} />
                    <span className="ios-slider"></span>
                  </label>
                  <span className="privacy-label">Private Board</span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancel glass-morphism"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit ripple-effect">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarCreateBoardModal
