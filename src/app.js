require('dotenv').config()
require('module-alias/register')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const apiRouter = express.Router()
const morgan = require('morgan')

const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

const errorException = require('./middlewares/errorException')
const authRouter = require('./modules/userModule/routes/authRoute')
const userRouter = require('./modules/userModule/routes/userRoute')

app.use('/api', apiRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)

app.use(errorException)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
