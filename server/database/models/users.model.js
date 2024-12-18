import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	fullname: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	enabled: {
		type: Boolean,
		required: true
	}
},{
	timestamps: true
})

userSchema.set('toJSON', {
	transform: (document,returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.password
	}
})

export default mongoose.model('User', userSchema)
