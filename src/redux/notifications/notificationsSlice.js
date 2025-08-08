import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authoriseAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null,
}

export const fetchInvitationApi = createAsyncThunk(
  'notifications/fetchInvitationApi',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationApi = createAsyncThunk(
  'notifications/updateBoardInvitationApi',
  async ({ notificationId, status }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${notificationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotification: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotification: (state, action) => {
      state.currentNotifications = action.payload
    },
    // Thêm mới một cái bản ghi notification vào đầu mảng currentNotifications
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationApi.fulfilled, (state, action) => {
      const incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
    builder.addCase(updateBoardInvitationApi.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      const getInvitation = state.currentNotifications.find(i => i._id == incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

export const { clearCurrentNotification, updateCurrentNotification, addNotification } = notificationsSlice.actions

export const selectorCurrentNotification = (state) => {
  return state.notifications.currentNotifications
}


export const notificationsReducer = notificationsSlice.reducer
