import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
//	    await mongoose.connect('mongodb://localhost/squidusers')
	    await mongoose.connect('mongodb+srv://meverss:PM6MFwIEnUABjgVR@cluster0.l4evt.mongodb.net/squidusers')
	    console.log('>>> Connected to Database.')
	} catch (error) {
	    console.log(error)
	}
} 
