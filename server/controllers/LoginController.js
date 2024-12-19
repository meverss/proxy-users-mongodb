import User from '../database/models/users.model.js'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'

export const userLogin = async (req, res) => {
    const { user, password } = req.body

    let userFound = await User.findOne({ user })
    let newAdmin = false
    let message = 'Usuario autenticado'
    let newAdminMessage = 'Se ha creado un usuario ADMINISTRADOR'
    let id = ''
    let fullname = ''
    let passwordHashed = ''
    
    // Create Admin if it doesn't exist
    if(!userFound && user === 'admin'){
	try {
	    const hash = await argon2.hash(password, {type: argon2.argon2id })
	    const createdAdmin = new User({
		user: 'admin',
		fullname: 'Administrador',
		password: hash,
		enabled: true
	    })

	    createdAdmin.save()
	    message = newAdminMessage
	    id = createdAdmin._id
	    fullname = createdAdmin.fullname
	    passwordHashed = createdAdmin.password
	    newAdmin = true
	    
	    console.log('Created an ADMIN user')
			
	} catch (error) {
	    console.log(error)
	}  
    } else if(userFound){
	id = userFound._id
    	fullname = userFound.fullname
	passwordHashed = userFound.password
    }

    // Verify credentials and create token //

    const authorizedUser = ((userFound && userFound.enabled == true) || newAdmin)
    if(authorizedUser){
	const argon2format = /^\$argon2id\$v=(?:16|19)\$m=\d{1,10},t=\d{1,10},p=\d{1,3}(?:,keyid=[A-Za-z0-9+/]{0,11}(?:,data=[A-Za-z0-9+/]{0,43})?)?\$[A-Za-z0-9+/]{11,64}\$[A-Za-z0-9+/]{16,86}$/i
	const chkformat = argon2format.test(passwordHashed)
	const verifyPassword = chkformat && await argon2.verify(passwordHashed, password)

	if (verifyPassword) {
    	    const TOKEN_KEY = process.env.SECRET
    	    const token = jwt.sign({ id, user, fullname }, TOKEN_KEY, { expiresIn: '1h' })

    	    res.json({ id, user, fullname, token, message })
    	    
	} else {
	    res.sendStatus(403)
	}
    } else {
	res.sendStatus(403)
    }
}
	
