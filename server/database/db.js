import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
	    await mongoose.connect('mongodb://localhost/squidusers')
	    console.log('>>> Connected to DB...')
	} catch (error) {
	    colsole.log(error)
	}
} 