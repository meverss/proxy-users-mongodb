import app from './app.js'
import { PORT } from './config.js'
import { connectDB } from './database/db.js'
import sendEmail from './libs/mailer.js'

// Settings
app.set('case sensitive routing', true)
app.set('appName', 'proxy-users')

// Run Server
connectDB()
app.listen(PORT, () => {
  console.log(`>>> Server listenning on port ${PORT}.`)
})
