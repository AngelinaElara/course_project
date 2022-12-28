import {useState, useCallback, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHttp } from '../../../hooks/http.hook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import addBtn from '../../../ui/addBtn.png'

const AdminProfile = ({
  tableStyle
}) => {
  const [users, setUsers] = useState([])
  const {request} = useHttp()
  const { t } = useTranslation()

  const fetchUsers = useCallback(async () => {
    try { 
      let getUsers = await request('/users/', 'GET') 
      setUsers(getUsers)
    } catch (e) {
      console.error(e)
    }  
  }, [request])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <>
      {users.length 
        ? <Table style={tableStyle}>
            <thead>
              <tr>
                <th scope='col'></th>
                <th scope='col'>{t('nameUser')}</th>
                <th scope='col'>E-mail</th>
                <th scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                return (
                  <tr key={user._id}>
                    <td>
                      <Button>Block</Button>
                    </td>
                    <td>
                      <Link to={`/user/${user._id}`}>
                        {user.name}
                      </Link></td>
                    <td>{user.email}</td>
                    <td>
                      <Link 
                        to={`/review/${user._id}`} 
                        style={{top: '15px', left: '20px'}}
                      > 
                        <img 
                          src={addBtn}
                          alt='Add new review'
                          style={{width: '40px', height: '40px'}}
                        />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        : <div>No users</div>
      }
    </>
  )
}

export default AdminProfile