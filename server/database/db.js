import mongoose from 'mongoose'

export const connectDB = async () => {
    const USER = process.env.DB_USER
    const PASSWORD = process.env.DB_PASSWORD
	try {
//	    await mongoose.connect('mongodb://localhost/squidusers')
	    await mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@cluster0.l4evt.mongodb.net/squidusers`)
	    console.log('>>> Connected to Database.')
	} catch (error) {
	    console.log(error)
	}
} 
