const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const StrategyJwt = passportJwt.Strategy
const User = require('../models/User')
const config = require('config')

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwtSecret'),
    },
    function (jwtPayload, done) {
      return User.findOne({where: {id: jwtPayload.id}})
        .then((user) => {
          return done(null, user)
        })
        .catch((err) => {
          return done(err)
        })
    }
  )
)