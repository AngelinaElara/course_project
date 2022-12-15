import {Routes, Route} from 'react-router-dom'
import Main from '../pages/Main'
import Login from '../pages/Login'
import Authorization from '../pages/Authorization'
import Review from '../pages/Review'
import Profile from '../pages/Profile'
import ReviewDetails from '../pages/ReviewDetails'

export const useRoutes = (isAuth) => {
  if (isAuth) {
    return (
      <Routes>
        <Route path='*' element={<Main />} />
        <Route path='/' element={<Main />} />
        <Route path='/review' element={<Review />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/:id' element={<ReviewDetails />} />
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