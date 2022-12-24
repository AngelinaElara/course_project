import Button from 'react-bootstrap/Button'

const ButtonsReviews = ({
  handlePopularReviewButtonClick,
  handleLastReviewButtonClick,
  isButtonPopularActive,
  isButtonLastActive
}) => {
  return (
    <div className='d-flex flex-row gap-2'> 
      <Button 
        onClick={handlePopularReviewButtonClick}
        className={isButtonPopularActive ? 'btn-primary' : 'btn-light'}
      >
        Popular Reviews
      </Button>
      <Button 
        onClick={handleLastReviewButtonClick}
        className={isButtonLastActive ? 'btn-primary' : 'btn-light'}
      >
        Latest Reviews
      </Button>
    </div>
  )
}

export default ButtonsReviews