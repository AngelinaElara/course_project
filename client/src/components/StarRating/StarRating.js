import {useState, useContext} from 'react'
import {Context} from '../../context/Context'
import '../../style/StarRating.css'

const StarRating = ({
  rating,
  setRating,
  lengthArray
}) => {
  const [hover, setHover] = useState(0)

  const context = useContext(Context)

  const handleStarButtonClick = (index) => {
    setRating(index)
  }

  return (
    <div>
      {[...Array(lengthArray)].map((star, index) => {
        index += 1
        return (
          <button
            type='button'
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={() => handleStarButtonClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer'}}
          >
            <span>&#9733;</span>
          </button>
        )
      })}
    </div>
  )
}

export default StarRating