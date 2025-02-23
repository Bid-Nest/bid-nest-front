import session from 'express-session';
import { config } from 'config/index';

const expressSession = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: config.cookieMaxAge,
  },
});
export default expressSession;
