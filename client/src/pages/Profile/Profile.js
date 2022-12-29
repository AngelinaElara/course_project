import {useState, useEffect, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import {useAuth} from '../../hooks/auth.hook'
import { Context } from '../../context/Context'
import Button from 'react-bootstrap/Button'
import { storage } from '../../firebase/index'
import { ref, deleteObject } from 'firebase/storage'
import {Link} from 'react-router-dom'
import moment from 'moment'
import addBtn from '../../ui/addBtn.png'
import axios from 'axios'
import UserProfile from './UserProfile/UserProfile'
import AdminProfile from './AdminProfile/AdminProfile'
import { useTranslation } from 'react-i18next'

const Profile = ({
  data,
  currentUserBlocked
}) => {
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const [dataReviews, setDataReviews] = useState([])
  const {userId, role} = useAuth() 
  const {request} = useHttp()
  const context = useContext(Context)
  const tableStyle = context.lightTheme ? {color: 'black'} : {color: 'white'}
  const { t } = useTranslation()

  useEffect(() => {
    if(data && role === 'user') {
      const userReviews = data.filter(review => review.idFrom === userId)
      setDataReviews(userReviews) 
    }
  }, [data])

  const handleSelectAllCheckboxes = () => {
    setIsCheckAll(!isCheckAll)
    setIsCheck(dataReviews.map(review => review._id))
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

  const handleFilterCategoryChange = (event) => {
    const value = event.target.value
    if(value === '') {
      setDataReviews(data)
    } else {
      setDataReviews(data.filter(review => review.category.indexOf(value) >= 0)) 
    }
  }

  const handleSortChange = (event) => {
    const value = event.target.value
    const copy = [...dataReviews]
     if(value === 'newer') {
      copy.sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate)) 
    } else if(value === 'older') {
      copy.sort((a,b) => new Date(a.publishDate) - new Date(b.publishDate))
    } else if (value === 'more') {
      copy.sort((a,b) => b.ratingAuth - a.ratingAuth)
    } else if (value === 'lower') {
      copy.sort((a,b) => a.ratingAuth - b.ratingAuth)
    } 
    setDataReviews(copy)
  }

  const handleDeleteBtn = async () => {
    if(isCheck.length) {
      const data = await request(`/review`, 'DELETE', {id: isCheck})
      window.location.reload()
    }
    for(let checkItem of isCheck) {
      const findReview = dataReviews.filter(review => review._id === checkItem)
      if (findReview.img) {
        const desertRef = ref(storage, `reviews/${findReview.randomId}`)
        deleteObject(desertRef).then(() => {
          console.log('Image was deleted')
        }).catch((error) => {
          console.log('Image was not deleted')
        })
      }
    }
  }

  const handleLogoutBtnClick = async () => {
    context.logout()
    const response = await axios.get('http://5-180-180-221.cloud-xip.com:5000/auth/logout', {withCredentials: true}).catch(err => console.log(err))
    window.location.reload()
  }

  useEffect(() => {
    if(dataReviews.length) {
      return isCheck.length === dataReviews.length ? setIsCheckAll(true) : setIsCheckAll(false)
    } 
  }, [dataReviews, isCheck])

  return (
    <div 
      className='d-flex justify-content-center align-items-center flex-column position-relative' 
      style={{padding: '60px 20px'}}
    >
      <h1>{context.role === 'admin' ? t('users') : t('myReviews')}</h1>
      {context.role === 'admin' || currentUserBlocked
        ? '' 
        : <Link 
            to='/review' 
            className='position-absolute' 
            style={{top: '15px', left: '20px'}}
          > 
            <img 
              src={addBtn}
              alt='Add new review'
              style={{width: '40px', height: '40px'}}
            />
          </Link>
      }
      <Button 
        variant='secondary' 
        className='position-absolute' 
        style={{top: '10px', right: '20px'}}
        onClick={handleLogoutBtnClick} 
      >
        {t('logout')}
      </Button>

      {context.role === 'admin' 
        ? <AdminProfile 
            tableStyle={tableStyle}
          />
        : <UserProfile 
            tableStyle={tableStyle}
            dataReviews={dataReviews}
            isCheck={isCheck}
            isCheckAll={isCheckAll}
            handleClickOneCheckbox={handleClickOneCheckbox}
            handleSelectAllCheckboxes={handleSelectAllCheckboxes}
            handleDeleteBtn={handleDeleteBtn}
            handleFilterCategoryChange={handleFilterCategoryChange}
            handleSortChange={handleSortChange}
            request={request}
            userId={userId}
          />
      }
      
       
    </div>
  )
}

export default Profile 