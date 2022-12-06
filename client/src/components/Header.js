import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'
import addBtn from '../ui/addBtn.png'
import { useAuth } from '../hooks/auth.hook'
import user from '../ui/user.png'
import enter from '../ui/enter.png'

const Header = () => {
  const {token} = useAuth()
  const isAuth = !!token

  return (
    <header 
      style={{height: '60px', background: '#b0c4de'}}
    >
      <Navbar expand="lg" >
        <Container>
          {isAuth 
            ? <Link 
            to='review' 
            className='' 
            style={{width: '40px', height: '40px'}}
            >
            <img 
              src={addBtn}
              alt='Add new review'
              style={{width: '30px', height: '30px', transform: 'translateY(25%)'}}
            />
            </Link>
            : ''
          }
            
          <Form className='d-flex justify-content-center align-items-center gap-2'>
            <Form.Control type='search' placeholder='Search' style={{width: '370px'}}/>
          </Form>

          {isAuth 
            ? <Link to='/profile/:id'>
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