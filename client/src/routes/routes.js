import {Routes, Route} from 'react-router-dom'
import Main from '../pages/Main'
import Login from '../pages/Login'
import Authorization from '../pages/Authorization'
import Review from '../pages/Review'

export const useRoutes = (isAuth) => {
  if (isAuth) {
    return (
      <Routes>
        <Route path='*' element={<Main />} />
        <Route path='/' element={<Main />} />
        <Route path='/review' element={<Review />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path='*' element={<Main />} />
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/authorization' element={<Authorization />} />
    </Routes>
  )
}