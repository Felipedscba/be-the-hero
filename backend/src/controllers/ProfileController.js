const connection = require('../database/connections');

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;        
        const {page = 1, limit = 5} = request.query;

        if(!ong_id){
            return response.status(401).send()
        }

        const incidents = await connection('incidents')
            .where('ong_id', ong_id)            
            .limit(limit)
            .offset((page - 1 ) * limit)
            .select("*")

        const count = await connection('incidents')
            .where('ong_id', ong_id)
            .count()            
            .select("*")
            .first()

        response.header('X-Total-Count', count['count(*)'])
        
        return response.json(incidents)
    }
}