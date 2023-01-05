import { useTranslation } from 'react-i18next'

const Success = () => {
const { t } = useTranslation()

  return (
    <div style={{marginTop: '10px'}}>
      <h1 style={{textAlign: 'center'}}>{t('wasLogin')}</h1>
      <p style={{textAlign: 'center'}}>{t('closePage')}</p>
    </div>
  )
}

export default Success