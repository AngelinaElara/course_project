import {useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import {useAuth} from '../../hooks/auth.hook'
import { Context } from '../../context/Context'
import UserProfile from './UserProfile/UserProfile'
import AdminProfile from './AdminProfile/AdminProfile'
import axios from 'axios'

const Profile = ({
}) => {
  const {userId} = useAuth() 
  const {request} = useHttp()
  const context = useContext(Context)
  const tableStyle = context.lightTheme ? {color: 'black'} : {color: 'white'}

  const handleLogoutBtnClick = async () => {
    context.logout()
    const response = await axios.get('http://5-180-180-221.cloud-xip.com:5000/auth/logout', {withCredentials: true}).catch(err => console.log(err))
    window.location.reload()
  }

  return (
    <>
      {context.role === 'admin' 
        ? <AdminProfile 
            tableStyle={tableStyle}
            handleLogoutBtnClick={handleLogoutBtnClick}
          />
        : <UserProfile 
            tableStyle={tableStyle}
            request={request}
            userId={userId}
            handleLogoutBtnClick={handleLogoutBtnClick}
          />
        }
    </>
  )
}

export default Profile 