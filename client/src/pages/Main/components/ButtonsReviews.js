import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'

const ButtonsReviews = ({
  handlePopularReviewButtonClick,
  handleLastReviewButtonClick,
  isButtonPopularActive,
  isButtonLastActive
}) => {
  const { t } = useTranslation()

  return (
    <div className='d-flex flex-row gap-2'> 
      <Button 
        onClick={handlePopularReviewButtonClick}
        className={isButtonPopularActive ? 'btn-primary' : 'btn-light'}
      >
        {t('popularReviews')}
      </Button>
      <Button 
        onClick={handleLastReviewButtonClick}
        className={isButtonLastActive ? 'btn-primary' : 'btn-light'}
      >
        {t('latestReviews')}
      </Button>
    </div>
  )
}

export default ButtonsReviews