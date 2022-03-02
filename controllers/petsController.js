const Pet = require("./../models/Pet")

exports.getPets = async (req, res) => {

	const allPets = await Pet.find({})

	res.json({
		msg: "Se ha obtenido con éxito el listado de mascotas",
		data: allPets
	})

}

exports.createPet = async (req, res) => {
	
	// FORMULARIO
	const { name, description } = req.body

	const newPet	= await Pet.create({name, description})

	res.json({
		msg: "Se ha creado una mascota correctamente",
		data: newPet
	})
	

}