import { useState, useEffect, useCallback } from 'react'
import {useParams} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useHttp } from '../../../hooks/http.hook'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import addBtn from '../../../ui/addBtn.png'
import {Link} from 'react-router-dom'
import moment from 'moment'
import trash from '../../../ui/trash.png'
import { storage } from '../../../firebase/index'
import { ref, deleteObject } from 'firebase/storage'

const UserProfile = ({
  tableStyle,
  userId,
  handleLogoutBtnClick
}) => {
  const [currentUserBlocked, setCurrentUserBlocked] = useState(false)
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [data, setData] = useState([])
  const [isCheck, setIsCheck] = useState([])
  const [dataReviews, setDataReviews] = useState([])
  const [categories, setCategories] = useState([])
  const { t } = useTranslation()
  let {id}  = useParams()
  const {request} = useHttp()

  const handleGetUsersReviews = useCallback(async () => {
    try { 
      if(id) {
        let getData = await request(`/review/get/${id}`, 'GET') 
        setDataReviews(getData)
        setData(getData)
      } else {
        let getData = await request(`/review/get/${userId}`, 'GET') 
        setDataReviews(getData)
        setData(getData)
      }
    } catch (e) {
      console.error(e)
    } 
  }, [userId, request]) 

  const handleGetCategories = useCallback(async () => {
    try {
      const getCategories = await request('/category/all', 'GET')
      setCategories(getCategories)
    } catch (error) {
      console.log(error)
    }
  }, [request])

  const handleGetCurrentUserStatus = useCallback(async () => {
    try { 
      if(userId) {
        const blocked = await request(`/users/${userId}`, 'GET')
        setCurrentUserBlocked(blocked)
      }
    } catch (e) {
      console.error(e)
    }  
  }, [request, userId])

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
      window.location.reload()
      const data = await request(`/review`, 'DELETE', {id: isCheck})
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
    window.location.reload()
  }

  useEffect(() => {
    handleGetCategories()
  }, [handleGetCategories])

  useEffect(() => { 
    handleGetUsersReviews()
  }, [handleGetUsersReviews])

   useEffect(() => {
    handleGetCurrentUserStatus() 
  }, [handleGetCurrentUserStatus])

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
      <h1>{t('myReviews')}</h1>
      {currentUserBlocked || id
        ? '' 
        : <Link 
            to={`/new`}
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
      {id 
        ? '' 
        : <Button 
            variant='secondary' 
            className='position-absolute' 
            style={{top: '10px', right: '20px'}}
            onClick={handleLogoutBtnClick} 
          >
            {t('logout')}
          </Button>
      }
      <div className='d-flex justify-content-between align-items-center flex-row gap-4'>  
        <button 
          className='btn d-flex justify-content-center align-items-center'
          onClick={handleDeleteBtn}
        >
          <img 
            src={trash}
            alt='trash icon'
            style={{ width: '50px', height: '50px' }}
          />
        </button>
        <Form.Select 
          onChange={handleFilterCategoryChange} 
          style={{textTransform: 'capitalize'}}
        >
          <option value=''>{t('filterCategory')}</option>
          {categories && categories.map(category => {
            return (
              <option
                value={category.category}
                style={{textTransform: 'capitalize'}} 
              >
                {category.category}
              </option>
            )
          })}    
        </Form.Select>
        <Form.Select onChange={handleSortChange}>
          <option value=''>{t('sort')}</option>
          <option value='newer'>{t('newer')}</option>
          <option value='older'>{t('older')}</option> 
          <option value='more'>{t('moreRated')}</option>
          <option value='lower'>{t('lowerRating')}</option>
        </Form.Select>
      </div>
      {dataReviews.length 
        ? <Table style={tableStyle} className='table-borderless'>
            <thead>
              <tr>
                <th 
                  scope='col' 
                  className='d-flex gap-2 flex-row justify-content-start align-items-center'
                >
                  {t('check')}
                  <input 
                    id='selectAll'
                    type={'checkbox'}
                    onChange={handleSelectAllCheckboxes} 
                    checked={isCheckAll}
                  />
                </th>
                <th scope='col'>{t('name')}</th>
                <th scope='col'>{t('publish')}</th>
                <th scope='col'>{t('yourScore')}</th>
              </tr>
            </thead>
            <tbody>
              {dataReviews.map((review) => {
                return ( 
                  <tr key={review._id}>
                    <td>
                      <input 
                        id={review._id} 
                        checked={isCheck.includes(review._id)} 
                        onChange={handleClickOneCheckbox} 
                        type={'checkbox'} 
                      />
                    </td>
                    <td><Link to={`/review/${review._id}`}>{review.title}</Link></td>
                    <td>{moment(review.publishDate).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    <td className='d-flex flex-row gap-2'>
                      {review.ratingAuth} 
                      <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span> 
                    </td>
                  </tr>
                )
              })}
            </tbody> 
          </Table>
        : <p className='mt-2' style={{textAlign: 'center'}}>{t('noReview')}</p>
      }   
    </div>
  )
}

export default UserProfile