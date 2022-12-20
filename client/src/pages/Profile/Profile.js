import {useState, useEffect, useCallback, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import {useAuth} from '../../hooks/auth.hook'
import { useAuth0 } from '@auth0/auth0-react'
import { Context } from '../../context/Context'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { storage } from '../../firebase/index'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import {Link} from 'react-router-dom'
import moment from 'moment'
import trash from '../../ui/trash.png'
import addBtn from '../../ui/addBtn.png'

const Profile = () => {
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const [dataReviews, setDataReviews] = useState([])
  const [data, setData] = useState([])
  const {token, userId} = useAuth()
  const {request} = useHttp()
  const context = useContext(Context)
  const { isAuthenticated, logout } = useAuth0()
  const tableStyle = context.lightTheme ? {color: 'black'} : {color: 'white'}

  const fetchReviews = useCallback(async () => {
    try { 
      let getData = await request(`/review/get/${userId}`, 'GET') 
      setDataReviews(getData)
      setData(getData)
    } catch (e) {
      console.error(e)
    } 
  }, [token, request]) 

  const handleSelectAllCheckboxes = e => {
    setIsCheckAll(!isCheckAll)
    setIsCheck(dataReviews.map(review => review._id))
    if (isCheckAll) {
      setIsCheck([])
    } 
  } 
  
  const handleClickOneCheckbox = e => {
    const { id, checked } = e.target
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
    fetchReviews()
  }, [fetchReviews]) 

  return (
    <div 
      className='d-flex justify-content-center align-items-center flex-column position-relative' 
      style={{padding: '60px 20px'}}
    >
      <h1>My reviews</h1>
      <Link 
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
      <Button 
        variant='secondary' 
        className='position-absolute' 
        style={{top: '10px', right: '20px'}}
        onClick={() => context.logout()}
      >
        Logout
      </Button>
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
        <Form.Select onChange={handleFilterCategoryChange}>
          <option value=''>Filter by category</option>
          <option value='films'>Films</option> 
          <option value='books'>Books</option> 
          <option value='games'>Games</option>    
        </Form.Select>
        <Form.Select onChange={handleSortChange}>
          <option value=''>Sort by</option>
          <option value='newer'>Newer</option>
          <option value='older'>Older</option> 
          <option value='more'>More rated</option>
          <option value='lower'>Lower rating</option>
        </Form.Select>
      </div>
      {dataReviews.length 
        ? <Table style={tableStyle}>
            <thead>
              <tr>
                <th scope='col' className='d-flex gap-2 flex-row justify-content-start align-items-center'>
                  Check
                  <input 
                    id='selectAll'
                    type={'checkbox'}
                    onChange={handleSelectAllCheckboxes} 
                    checked={isCheckAll}
                  />
                </th>
                <th scope='col'>Name</th>
                  <th scope='col'>Publication date</th>
                  <th scope='col'>Your review score</th>
              </tr>
            </thead>
            <tbody>
              {dataReviews.map((review, index) => {
                return ( 
                  <tr key={review._id}>
                    <td>
                      <input id={review._id} checked={isCheck.includes(review._id)} onChange={handleClickOneCheckbox} type={'checkbox'} />
                    </td>
                    <td><Link to={`/profile/${review._id}`}>{review.title}</Link></td>
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
        : <p className='mt-2' style={{textAlign: 'center'}}>You haven't review...</p>
      }    
    </div>
  )
}

export default Profile 