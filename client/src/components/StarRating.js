import {useState, useEffect} from 'react'
import '../style/StarRating.css'
import { useHttp } from '../hooks/http.hook'

const StarRating = ({
  rating,
  setRating,
  lengthArray,
  isUserClick,
  userId,
  reviewId,
  isAuth
}) => {
  const [hover, setHover] = useState(0)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const {request} = useHttp()

  const handleStarButtonClick = (index) => {
    setRating(index)
  }

  const handleUserButtonClick = async (index) => {
    try {
      setRating(index)
      setIsButtonDisabled(true)
      const userRating = {
        userId: userId,
        rating: index
      }
      const sendUserRating = await request(`/review/userrating/${reviewId}`, 'PATCH', userRating)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!isAuth) setIsButtonDisabled(true)
  }, [isAuth])

  useEffect(() => {
    if(rating) setIsButtonDisabled(true)
  }, [rating])

  return (
    <div>
      {[...Array(lengthArray)].map((star, index) => {
        index += 1
        return (
          <button
            type='button'
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={!isUserClick ? () => handleStarButtonClick(index) : () => handleUserButtonClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer'}}
            disabled={isButtonDisabled}
          >
            <span>&#9733;</span>
          </button>
        )
      })}
    </div>
  )
}

export default StarRating