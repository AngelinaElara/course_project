import {useState, useCallback, useEffect} from 'react'

export const useReview = () => {
  const [ratingAuth, setRatingAuth] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const setData = useCallback((rating, url) => {
    setRatingAuth(rating)
    setImageUrl(url)
  }, [])

  return {setData, ratingAuth, imageUrl}
}