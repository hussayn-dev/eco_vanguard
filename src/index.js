require('express-async-errors')
require("dotenv").config()
const express = require('express')
// const passport = require("passport")
// const methodOverride = require('method-override')
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const  bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express()


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors( {

}))
app.use(xss());
app.use(mongoSanitize());



// const initializePassport = require("./config/passport")
// const googleStrategy = require('./config/oauthGoogle');
// const facebookStrategy = require('./config/oauthFacebook')

const authRouter = require("./routes/authRoute")
const userRouter = require("./routes/userRoute")
const projectRouter = require("./routes/projectRoute")
const eventRouter = require("./routes/eventRoute")
const profileRouter = require("./routes/profileRoute")
const messageRouter = require("./routes/messageRoute")
const {notFound, errorHandler} = require("./middlewares/error-handler")


app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.JWT_SECRET));
app.use(logger('dev'));
app.use(express.json())


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/event", eventRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/message", messageRouter)

app.use(notFound)
app.use(errorHandler)  

 

module.exports = app;



