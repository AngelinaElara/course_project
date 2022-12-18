import {useEffect, useContext} from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import { useAuth } from '../hooks/auth.hook'
import { Context } from '../context/Context'
import user from '../ui/user.png'
import enter from '../ui/enter.png'
import sun from '../ui/sun.png'
import moon from '../ui/moon.png'

const Header = ({
  isLightTheme,
  setIsLightTheme
}) => {
  const {token} = useAuth()
  const isAuth = !!token
  const context = useContext(Context)

  const headerStyle = isLightTheme ? {height: '60px', background: '#b0c4de'} : {height: '60px', background: '#202020'}

  const handleThemeButtonClick = () => {
    setIsLightTheme(prevValue => !prevValue)
    context.lightTheme = isLightTheme
    console.log(context.lightTheme)
  }

  useEffect(() => {
    localStorage.setItem('theme', context.lightTheme)
  }, [context.lightTheme])

  return (
    <header 
      style={headerStyle}
    >
      <Navbar expand='lg'>
        <Container>
          <Link to='/'>Logo</Link>

          <Form className='d-flex justify-content-center align-items-center gap-2' style={{width: '50%'}}>
            <Form.Control type='search' placeholder='Search'/>
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
                style={{width: '30px', height: '30px', transform: 'translateY(15%)'}}
                />
            </Link>
          }
          
        </Container>
      </Navbar>
    </header>
  )
}

export default Header