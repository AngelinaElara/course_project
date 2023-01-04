import {useState, useCallback, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHttp } from '../../../hooks/http.hook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import addBtn from '../../../ui/addBtn.png'
import trash from '../../../ui/trash.png'
import block from '../../../ui/block.png'
import unblock from '../../../ui/ublock.png'
import CreateCategory from './components/CreateCategory'
import {ReactComponent as Heart} from '../../../ui/heart.svg'

const AdminProfile = ({
  tableStyle,
  handleLogoutBtnClick
}) => {
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const [users, setUsers] = useState([])
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  const {request} = useHttp()
  const { t } = useTranslation()

  const handleFetchUsers = useCallback(async () => {
    try { 
      let getUsers = await request('/users/', 'GET') 
      setUsers(getUsers)
    } catch (e) {
      console.error(e)
    }  
  }, [request])

   const handleSelectAllCheckboxes = () => {
    setIsCheckAll(!isCheckAll)
    setIsCheck(users.map(users => users._id))
    if (isCheckAll) {
      setIsCheck([])
    } 
  } 
  
  const handleClickOneCheckbox = (event) => {
    const { id, checked } = event.target
    setIsCheck([...isCheck, id])
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id))
      setIsCheckAll(false) 
    } 
  }

  const handleDeleteUser = async () => {
    try {
      if(isCheck.length) {
        window.location.reload()
        const deleteUsers = await request(`/users/delete`, 'DELETE', {id: isCheck})
      }
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleBlockUser =  async () => {
    try {
      if(isCheck.length) {
        window.location.reload()
        const blockUsers = await request('/users/changeblock', 'PATCH', {blocked: true, id: isCheck})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnblockUser =  async () => {
    try {
      if(isCheck.length) {
        window.location.reload()
        const unBlockUsers = await request('/users/changeblock', 'PATCH', {blocked: false, id: isCheck})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGiveAdminRights = async () => {
    try {
      if(isCheck.length) {
        window.location.reload()
        const makeAdmin = await request('/users/admin', 'PATCH', {id: isCheck, role: 'admin'})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewCategoryButtonClick = () => {
    setIsNewCategoryOpen(true)
  }

  useEffect(() => {
    handleFetchUsers()
  }, [handleFetchUsers])

  useEffect(() => {
    if(users.length) {
      return isCheck.length === users.length ? setIsCheckAll(true) : setIsCheckAll(false)
    } 
  }, [users, isCheck])

  return (
    <div 
      className='d-flex justify-content-center align-items-center flex-column position-relative' 
      style={{padding: '60px 20px'}}
    >
      <h1>{t('users')}</h1>
      <Button 
        variant='secondary' 
        className='position-absolute' 
        style={{top: '10px', right: '20px'}}
        onClick={handleLogoutBtnClick} 
      >
        {t('logout')} 
      </Button>
      <div className='d-flex justify-content-between align-items-center flex-row gap-4'>  
        <button 
          className='btn d-flex justify-content-center align-items-center'
          onClick={handleDeleteUser}
        >
          <img 
            src={trash}
            alt='trash icon'
            style={{ width: '50px', height: '50px' }}
          />
        </button>
        <button 
          onClick={handleBlockUser} 
          style={{ width: '40px', height: '40px' }} 
          className='btn d-flex justify-content-center align-items-center'
        >
          <img style={{ width: '20px', height: '20px' }} src={block} alt='block icon'/>
        </button>
        <button 
          onClick={handleUnblockUser} 
          style={{ width: '40px', height: '40px' }} 
          className='btn d-flex justify-content-center align-items-center'
        >
          <img style={{ width: '20px', height: '20px'}} src={unblock} alt='unblock icon'/>
        </button>
        <Button variant='light' onClick={handleGiveAdminRights}>
          {t('admin')}
        </Button>
        <Button onClick={handleNewCategoryButtonClick}>
          {t('newCategory')}
        </Button> 
      </div>
      {users.length 
        ? <Table style={tableStyle}>
            <thead>
              <tr>
                <th scope='col' className='d-flex gap-2 flex-row justify-content-start align-items-center'>
                  {t('check')}
                  <input 
                    id='selectAll' 
                    type={'checkbox'}
                    onChange={handleSelectAllCheckboxes} 
                    checked={isCheckAll}
                  />
                </th>
                <th scope='col'>{t('nameUser')}</th>
                <th scope='col'>{t('status')}</th>
                <th scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                return ( 
                  <tr key={user._id}>
                    <td>
                      <input 
                        id={user._id} 
                        checked={isCheck.includes(user._id)} 
                        onChange={handleClickOneCheckbox} 
                        type={'checkbox'} 
                      />
                    </td>
                    <td className='d-flex flex-row gap-2'>
                      <Link to={`/profile/${user._id}`}>
                        {user.name}
                      </Link>
                      <div className='d-flex flex-row gap-1 align-items-center'>
                        {user.likes}
                        <Heart style={{width: '10px', height: '10px', fill: 'red'}}/>
                      </div>
                    </td>
                    <td>{user.blocked ? t('block') : t('unBlock')}</td>
                    {user.blocked 
                      ? ''
                      : <td>
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
                    }
                  </tr>
                )
              })}
            </tbody>
          </Table>
        : ''
      }
      {isNewCategoryOpen ? <CreateCategory setIsNewCategoryOpen={setIsNewCategoryOpen}/> : ''}
    </div>
  )
}

export default AdminProfile