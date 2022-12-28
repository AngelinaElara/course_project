import {useState, useEffect, useContext, useMemo} from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import {Link} from 'react-router-dom'
import { useAuth } from '../hooks/auth.hook'
import { Context } from '../context/Context'
import user from '../ui/user.png'
import enter from '../ui/enter.png'
import sun from '../ui/sun.png'
import moon from '../ui/moon.png'
import { useTranslation } from 'react-i18next'

const Header = ({
  isLightTheme,
  setIsLightTheme,
  data
}) => {
  const [filterData, setFilterData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const {userId} = useAuth()
  const isAuth = !!userId
  const context = useContext(Context)
  const headerStyle = isLightTheme ? {height: '60px', background: '#b0c4de'} : {height: '60px', background: '#202020'}
  const { t } = useTranslation()

  useMemo(() => {
    const found = []
    if(searchValue && data) {
      const hasValue = (item, searchValue) => {
        item = item instanceof Array ? item.map(i => i.toLowerCase()).join(' ') : item.toLowerCase()
        return item.includes(searchValue.toLowerCase())
      }
      for(const review of data){

        for(const field of ['title', 'description', 'category', 'tags', 'comments']){
          let compareValue = review[field]
          if(field === 'tags') compareValue = compareValue.map(i => i.value)
          if(field === 'comments') compareValue = compareValue.map(i => i.text)
          if(hasValue(compareValue, searchValue)){
            found.push(review)
            break
          }
        }
      }
      setFilterData(found)
    }
  }, [searchValue])

  const handleThemeButtonClick = () => {
    setIsLightTheme(prevValue => !prevValue)
    context.lightTheme = isLightTheme
  }

  const handleListItemClick = () => {
    setSearchValue('')
    setFilterData([]) 
  }

  useEffect(() => {
    localStorage.setItem('theme', context.lightTheme)
  }, [context.lightTheme])

  return (
    <header 
      style={headerStyle}
    >
      <Navbar expand='lg' className='d-flex justify-content-between align-items-center'>
        <Container>
          <Link to='/'>Logo</Link>

          <Form className='d-flex justify-content-center align-items-center gap-2 position-relative' style={{width: '50%'}}>
            <Form.Control 
              type='search' placeholder={t('search')} 
              value={searchValue} 
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <ListGroup 
              as='ul' 
              className='position-absolute' 
              style={{width: '100%', top: '38px', zIndex: '2', maxHeight: '200px', height: 'auto', overflow: 'auto'}}
            >
              {searchValue && filterData
                ? filterData.map((data, index) => {
                  return ( 
                    <ListGroup.Item key={index} onClick={handleListItemClick} as='li'>
                      <Link to={`/${data._id}`}>
                        {data.title}
                      </Link>
                    </ListGroup.Item>
                  )
                })
                : ''}
            </ListGroup>
          </Form>

          <button 
            style={{border: 'none', background: 'transparent'}} 
            onClick={handleThemeButtonClick}
          >
            <img 
              src={isLightTheme ? moon : sun}
              alt='theme img'
              style={{width: '30px', height: '30px'}}
            />
          </button>

          {isAuth 
            ? <Link to='/profile'>
                <img 
                  src={user}
                  alt='user icon'
                  style={{width: '40px', height: '40px'}}
                />
              </Link>
            : <Link to='/login'>
              <img 
                src={enter}
                alt='enter icon'
                style={{width: '35px', height: '35px'}}
                />
            </Link>
          }
          
        </Container>
      </Navbar>
    </header>
  )
}

export default Header