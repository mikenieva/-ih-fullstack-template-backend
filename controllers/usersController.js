const bcryptjs = require("bcryptjs")
const jwt	= require("jsonwebtoken")

const User = require("./../models/User")



exports.create = async (req, res) => {


	const { 
		name, 
		lastname, 
		email, 
		password } = req.body


		try {
			// 1. VERIFICACIÓN DEL PASSWORD Y ENCRIPTARLO
			const salt = await bcryptjs.genSalt(10)
			const hashedPassword = await bcryptjs.hash(password, salt)

			console.log(hashedPassword)

			// 2. CREACIÓN DEL USUARIO
			const newUser = await User.create({
				name,
				lastname,
				email,
				password: hashedPassword
			})

			console.log(newUser)

			// - GESTIÓN DE JWT - AUTENTICACIÓN
			// CUANDO EL USUARIO SE REGISTRA, YA NO ES NECESARIO QUE INICIE SESIÓN EN ESE MOMENTO.

			// A. CREACIÓN DEL PAYLOAD (DATOS)
			const payload = {
				user: {
					id: newUser._id
				}
			}

			// B. CREACIÓN DE JSON WEB TOKEN
			jwt.sign(
				payload, // DATOS QUE ACOMPAÑAN
				process.env.SECRET,
				{
					expiresIn: 3600000
				},
				(error, token) => {
					if (error) throw error

					res.json({
						msg: "Usuario creado con éxito",
						data: token
					})

				}
			)



		} catch (error) {
			console.log(error)

			res.json({
				msg: "Hubo un error en el proceso de creación del usuario."
			})

		}


}


exports.login = async (req, res) => {

	const { email, password } = req.body

	try {
		
		const foundUser = await User.findOne({ email })

		if(!foundUser) {
			return res.json({
				msg: "El usuario no fue encontrado."
			})
		}

		const verifiedPass = await bcryptjs.compare(password, foundUser.password)


		if(!verifiedPass){
			return await res.json({
				msg: "El usuario o la contraseña no coinciden"
			})
		}

		// GESTIÓN DE JSONWEBTOKEN

		// A. PAYLOAD

		const payload = {
			user: {
				id: foundUser._id
			}
		}

		jwt.sign(
			payload,
			process.env.SECRET,
			{
				expiresIn: 3600000
			},
			(error, token) => {
				if(error) throw error


				res.json({
					msg: "Inicio de sesión exitoso.",
					data: token
				})

			}
		)

		return

	} catch (error) {

		console.log(error)

		res.json({
			msg: "Hubo un problema con la autenticación."
		})
		
	}


}


exports.verifyToken = async (req, res) => {

	console.log(req.user)

	try {
		
		const foundUser = await User.findById(req.user.id).select("-password")


		return res.json({
			msg: "Datos de usuario encontrados.",
			data: foundUser
		})

	} catch (error) {
		console.log(error)

		res.json({
			msg: "Hubo un error actualizando el usuario."
		})

	}

 
}