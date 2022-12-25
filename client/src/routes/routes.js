import {Routes, Route} from 'react-router-dom'
import Main from '../pages/Main'
import Login from '../pages/Login'
import Authorization from '../pages/Authorization'
import CreateReview from '../pages/CreateReview'
import Profile from '../pages/Profile'
import AuthReviewDetails from '../pages/AuthReviewDetails'
import ReviewDetails from '../pages/ReviewDetails'
import Success from '../components/OAuth/components/Success'
import Error from '../components/OAuth/components/Error'
import TagsList from '../pages/TagsList/TagsList'

export const useRoutes = (
  isAuth,
  tags,
  data
) => {
  if (isAuth) {
    return (
      <Routes>
        <Route 
          path='*' 
          element={<Main tags={tags} data={data} />} 
        />
        <Route 
          path='/' 
          element={<Main tags={tags} data={data}/>} 
        />
        <Route 
          path='/:id' 
          element={<ReviewDetails data={data}/>} 
        />
        <Route 
          path='/review' 
          element={<CreateReview listTags={tags}/>} 
        />
        <Route 
          path='/profile' 
          element={<Profile data={data}/>} 
        />
        <Route 
          path='/profile/:id' 
          element={<AuthReviewDetails data={data}/>} 
        />
        <Route path='/search' element={<TagsList />}/>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route 
        path='*' 
        element={<Main tags={tags} data={data}/>} 
      />
      <Route 
        path='/' 
        element={<Main tags={tags} data={data}/>} 
      />
      <Route 
        path='/:id' 
        element={<ReviewDetails data={data}/>} 
      />
      <Route path='/login' element={<Login />} />
      <Route path='/authorization' element={<Authorization />} />
      <Route path='/login/success' element={<Success />} />
      <Route path='/login/error' element={<Error />} />
      <Route path='/search' element={<TagsList />}/>
    </Routes>
  )
}