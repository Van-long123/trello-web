import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useDispatch } from 'react-redux'
import { setUser } from '~/redux/user/userSlice'
import { verifyOAuth } from '~/apis'

function LoginSuccess() {
  let [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const { id, token } = Object.fromEntries([...searchParams])
    if (!id || !token) {
      navigate('/login')
      return
    }
    verifyOAuth({ id, token }).then((user) => {
      dispatch(setUser(user))
      navigate('/boards')
    }).catch(() => navigate('/login'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <PageLoadingSpinner caption='Loading...'/>
}
export default LoginSuccess
