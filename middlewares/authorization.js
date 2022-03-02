const jwt = require("jsonwebtoken")

const authorization = async (req, res, next) => {

	const token = req.header("x-auth-token")

	if(!token){
		return res.json({
			msg: "No hay token, permiso no válido."
		})
	}

	try {
		
		const openToken = await jwt.verify(token, process.env.SECRET)

		req.user = openToken.user

		next()


	} catch (error) {
		
		console.log(error)

		res.json(
			{
				msg: "Hubo un error con el token."
			}
		)

	}



}

module.exports = authorization