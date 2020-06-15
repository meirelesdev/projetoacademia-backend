'use strict'

const Training = use('App/Models/Training.js')
const Database = use('Database')
class TrainingController {

    async store({ request }) {
        const dataTraining = request.only(['name_training', 'type_training', 'description'])
        const training = await Training.create(dataTraining)
        return training
    }

    async show({ params }){
        const training = await Training.findOrFail(params.id)

        return training
    }

    async see({ params }){
        const type_training = params.type_training
        return await Database.table('trainings').where('type_training', type_training)
    }

    async index() {
        return await Training.all()
    }

    async update({ params, request, response }) {

        const training = await Training.findOrFail(params.id)

        const data = request.only(['name_training', 'type_training', 'description'])

        training.merge(data)

        await training.save()

        return training
    }

    async destroy({ params, auth, response }) {
        const user = await User.findOrFail(params.id)

        if (user.id !== auth.user.id) {
            return response.status(401).send({ error: 'Not authorized' })
        }

        await user.delete()

    }
}
module.exports = TrainingController
