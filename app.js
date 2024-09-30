import express from 'express'
import logger from "morgan"
import cors from "cors"

import { router as contactsRouter } from './routes/api/contactsRouter.js'
import {router as usersRouter } from './routes/api/usersRouter.js'

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)
app.use(express.static("public")) //creates a static file, which when we are inside the file when we go to localhost:3000/
//so if we go to files from avatar we can use localhost:3000/public/avatars

// 404 Error Handler
app.use((req, res) => {
  console.log("404 Error Handled")
  res.status(404).json({ message: 'Not found' })
})

// General Error Handler
app.use((err, req, res, next) => {
  console.log(err.message)
  res.status(500).json({ message: err.message })
})

export default app
