import {useState} from 'react'
import './StarRating.css'
const StarRating = () => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  console.log(rating)

  return (
    <div>
      {[...Array(10)].map((star, index) => {
        index += 1;
        return (
          <button
            type='button'
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer'}}
          >
            <span>&#9733;</span>
          </button>
        )
      })}
    </div>
  );
}

export default StarRating