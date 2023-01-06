import {useState, useCallback, useEffect} from 'react'

export const useReview = () => {
  const [imageUrl, setImageUrl] = useState(null)
  const [isImage, setIsImage] = useState(false)

  const setData = useCallback(( url, image) => {
    setImageUrl(url)
    setIsImage(image)
  }, [])

  return {setData, imageUrl, isImage}
}