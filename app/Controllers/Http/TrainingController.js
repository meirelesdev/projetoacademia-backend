'use strict'

const Training = use('App/Models/Training.js')

class TrainingController {

    async store({ request }) {
        const dataTraining = request.only(['name_training', 'description', 'series', 'repetition', 'interval', 'mat_id'])
        const training = await Training.create(dataTraining)
        return training
    }

    async update({ params, request, response }) {

        const user = await User.findOrFail(params.id)

        const data = request.only(['name_training', 'description', 'series', 'repetition', 'interval', 'mat_id'])

        user.merge(data)

        await user.save()

        return user
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
