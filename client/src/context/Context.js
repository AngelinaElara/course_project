import {createContext} from 'react'

function noop () {}

export const Context = createContext({
  name: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuth: false,
  imageUrl: null,
  isImage: false,
  lightTheme: true,
  language: 'en',
  role: ''
})