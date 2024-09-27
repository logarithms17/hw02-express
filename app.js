import express from 'express'
import logger from "morgan"
import cors from "cors"
import router from './routes/api/contactsRouter.js'

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', router)

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// General Error Handler
app.use((err, req, res, next) => {
  console.log(err.message)
  res.status(500).json({ message: err.message })
})

export default app
