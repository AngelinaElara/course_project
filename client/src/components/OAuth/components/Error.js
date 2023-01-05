import { useTranslation } from 'react-i18next'

const Error = () => {
  const { t } = useTranslation()

  return (
    <h1 style={{textAlign: 'center'}}>{t("wasn'tLogin")}</h1>
  )
}

export default Error