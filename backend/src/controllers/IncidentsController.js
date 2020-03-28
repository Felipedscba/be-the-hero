const connection = require('../database/connections');

module.exports = {
    async create(request, response){
        const { title, description, value } = request.body
        const ong_id = request.headers.authorization;
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        })
        return response.json({id});
    },

    async index(request, respose){
        const {page = 1, limit = 5} = request.query;

        const count = await connection('incidents').count().first();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(limit)
            .offset((page - 1 ) * limit)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ])                     
            
        respose.header('X-Total-Count', count['count(*)']);

        return respose.json(incidents)
    },

    async delete(request, respose){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select("ong_id")
            .first();
        
        if(incident == undefined){
            return respose.status(401).json({error: 'Usuário inexistente'});
        } else if(ong_id != incident.ong_id){
            return respose.status(401).json({error: 'Operação não permitida'});
        } 

        await connection('incidents').where('id', id).delete()
        return respose.status(204).send();
               
    }
}