import User from '../database/models/users.model.js'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'

export const userLogin = async (req, res) => {
    const { user, password } = req.body

    let userFound = await User.findOne({ user })
    let adminCreated = false
    let message = 'Bienvenido(a)!'
    let newAdminMessage = 'Se ha creado un usuario ADMINISTRADOR'

    // Create Admin if it doesn't exist
    if(!userFound && user === 'admin'){
	try {
	    const admpwd = await argon2.hash(password, {type: argon2.argon2id })
	    const createAdmin = new User({
		user: 'admin',
		fullname: 'Administrador',
		password: admpwd,
		enabled: true
	    })

	    createAdmin.save()
	    message = newAdminMessage
	    userFound = await User.findOne({ user })
	    adminCreated = true
	    
	    console.log('Created an ADMIN user')
			
	} catch (error) {
	    console.log(error)
	}  
    }
    
    if((userFound && userFound.enabled === true) || adminCreated === true){
	const id = userFound._id
	const { fullname } = userFound
	const passwordHashed = userFound.password

	// Verify credentials and create token //
	const argon2format = /^\$argon2id\$v=(?:16|19)\$m=\d{1,10},t=\d{1,10},p=\d{1,3}(?:,keyid=[A-Za-z0-9+/]{0,11}(?:,data=[A-Za-z0-9+/]{0,43})?)?\$[A-Za-z0-9+/]{11,64}\$[A-Za-z0-9+/]{16,86}$/i
	const chkformat = argon2format.test(passwordHashed)
	const verifyPassword = chkformat && await argon2.verify(passwordHashed, password)

	if (verifyPassword) {
	    const TOKEN_KEY = process.env.SECRET
    	    const token = jwt.sign({ id, user, fullname }, TOKEN_KEY, { expiresIn: '1h' })

    	    res.json({ id, user, fullname, token, message })
    	    console.log(message)
    	    
	} else {
	    res.status(401).json({
		message: 'Credenciales inválidas, intente de nuevo'
	    })
	}
    } else {
	res.status(401).json({
	    message: 'Usuario o contraseña incorrectos'
	})
    }
}
	
