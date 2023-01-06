const Notification = ({
  t
}) => {
  return (
    <div 
      className='position-absolute d-flex justify-content-center align-items-center'
      style={{width: '200px', height: '40px', top: '20px', right: '40px', background: 'white', borderRadius: '5px'}}
    >
      <p style={{color: '#787878', margin: '0'}}>{t('notification')}</p>
    </div>
  )
}

export default Notification