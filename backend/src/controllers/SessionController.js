const connection = require('../database/connections')

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ongs')
            .where('id', id)
            .first()
        if(!ong){
            return response.status(400).json({error: "Não foi encontrada ong com esse id!"})
        }
        return response.json(ong);
    }
}