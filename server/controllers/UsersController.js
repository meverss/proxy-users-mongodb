import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import User from '../database/models/users.model.js'
import sendMail from '../libs/mailer.js'

const passAuth = (req) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    return true
  }
}

// Get All Users
export const getAllUsers = async (req, res) => {
  if (passAuth(req)) {
    const auth = req.get('authorization')
    const token = (auth.split(' '))[1]
    const { id, user } = jwt.decode(token)
    
    try {
      const users = await User.find().sort({'user':1})
      if (user === 'admin') {
        res.json(users)
      } else {
        res.status(401).json({ message: 'Usuario no autorizado' })
      }
    } catch (error) {
      return res.status(500).json({
        message: `ALL USERS: Something went wrong: ${error}`
      })
    }
  } else {
    res.status(401).json({ message: 'Token incorrecto' })
  }
}

// Get One User
export const getOneUser = async (req, res) => {
  const { id } = req.params
  
  try {
    const auth = (req.headers.authorization).split(' ')
    const token = auth[1]

    const getAuthUser = jwt.decode(token)
    const authUser = getAuthUser.user

    const userFound = await User.findById({ _id:id })
    
    if (!authUser) {
      res.status(401).json({ message: 'Unauthorized user', authUser})
    } else {
	const { user, fullname, enabled, createdAt, updatedAt } = userFound
	
	res.status(200).json({ 
	user,
	fullname,
	enabled,
	createdAt,
	updatedAt,
	authUser 
	})
    }

  } catch (error) {
    return res.status(500).json({
      message: `ONE USER: Something went wrong: ${error}`
    })
  }
}

// Create a User
export const createUser = async (req, res) => {
  const { user, password, fullname } = req.body
  const auth = (req.headers.authorization).split(' ')
  const token = auth[1]
  const { id } = jwt.decode(token)
  const passwordHashed = await argon2.hash(password, {type: argon2.argon2id})

  try {
  	const newUser = new User({
  	    user,
  	    fullname,
  	    password: passwordHashed,
  	    enabled: true
  	})
  	  
  	await newUser.save()
  	
  	// Send e-mail
  	
  	
  	
  	/////

    console.log(`Added new user ${fullname}`)
    res.sendStatus(204)
  	  
  } catch (error){
	return res.status(500).json({
	message: `CREATE USER: Something went wrong: ${error}`})
  }
}

// Update a User (ALL)
export const updateUser = async (req, res) => {
  const { user, password, enabled, fullname } = req.body
  const passwordHashed = await argon2.hash(password, {type: argon2.argon2id})
  const { id } = req.params

  try {
    const updt = await User.updateOne({_id:id}, {user,fullname,password:passwordHashed,enabled})
    if (updt.matchedCount === 1) {
      console.log(`Updated user ${fullname}`)
      res.sendStatus(204)
    } else {
      console.log('Record not found')
      res.sendStatus(404)
    }
  } catch (error) {
    return res.status(500).json({
      message: `UPDATE USER: Something went wrong: ${error}`
    })
  }
}

// Update a User (No-Password)
export const updateUserNoPass = async (req, res) => {
  const { user, enabled, fullname } = req.body
  const { id } = req.params


  try {
    const updt = await User.updateOne({_id:id}, {user,fullname,enabled})
    if (updt.matchedCount === 1) {
      console.log(`Updated user ${fullname}`)
      res.sendStatus(204)
    } else {
      console.log('Record not found')
      res.sendStatus(404)
    }
  } catch (error) {
    return res.status(500).json({
      message: `UPDATE USER: Something went wrong: ${error}`
    })
  }
}

// Delete a User
export const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
	const usr = await User.findById({ _id:id})
        await User.findByIdAndDelete({_id:id})
        res.sendStatus(204)
        
	console.log(`User ${usr.fullname} has been deleted`)        
    } catch (error) {
	console.log(error)
    }
}

// Search if the New User is available
export const searchAvailableUser = async (req, res) => {

  try {
    const { user } = req.query
    const exists = await User.findOne({ user })
    if (!exists) {
      res.send({ available: true })
    } else {
      res.send({ available: false })
    }
  } catch (error) {
    res.send(req.query)
    return res.status(500).json({
      message: `SEARCH USER: Something went wrong: ${error}`
    })
  }
}
