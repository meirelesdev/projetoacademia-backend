'use strict'
// Chamando o model User Pois iremos usa-lo para carregar os dados do banco
const User = use('App/Models/User')
const Auth = use('App/Models/Auth')
// Helpers sera usado para manipular arquivos 
const Helpers = use('Helpers')
// Este é um modulo interno do node para escrever arquivos no servidor
const fs = use('fs')
// Esta constante ainda nao sei bem para que serve mas acredito que é o metodo do fs que 
// realmente este o arquivo no servidor
const readFile = Helpers.promisify(fs.readFile)
// Aqui sera o nome da pasta onde sera salvo a foto do usuario
const uploadDir = 'uploads'


class UserController {

    async store ({ request }){

/**Estes são os campos que eu espero receber ao cadastrar um usuario */
        //string('name', 80).notNullable().unique()
        //string('email', 254).notNullable().unique()
        //string('password', 60).notNullable()
        //string('photo', 254)
        //boolean('isAdmin')
        // Aqui atribuimos os dados recebidos em uma constante chamada dataUser
        const dataUser = request.only(['name','email','password','photo'])

        // Por padrao todo usuario que se cadastrar no site não sera
        dataUser.isAdmin = 0
        // Aqui estamos Pedindo para nosso Model User criar um novo registro no banco
        // e depois retornalo para a constante user
        const user = await User.create(dataUser)
        // Retornamos o novo registro
        return user
    }

    async update({ params, request }){

      const user = await User.findOrFail(params.id)

      const data = request.only(['name','email','photo','isAdmin','password'])

      user.merge(data)

      await user.save()

      return user
  }

    async index() {   
         
        return await User.all()
    }


    async show({ params }){
      
        const user = await User.findOrFail(params.id)

        return user
    }

    async destroy({ params }){
        
      // esta rota ira deletar qualquer usuarios que não seja admin        
        const user = await User.findOrFail(params.id)
        
        if(user.isAdmin) {
            return response.status(401).send({ error: 'Not authorized'})
        }

        await user.delete()
    }

    /**
       * Alterar a senha
       */
    async changePassword({ params, request, response, auth }){

      //Carrega o usuário do banco
      const user = await User.findOrFail(params.id)

      //Obtem a senha atual e a nova do POST
      const data = request.only(['passwordCurrent','passwordNew'])

      //Tenta autenticar com a senha atual. Se não conseguir será retornado um erro
      await auth.attempt(user.email, data.passwordCurrent)

      //Define a nova senha no usuário
      user.password = data.passwordNew

      //Salva no banco
      await user.save()

      //Retorna os dados do usuário em JSON
      return user
    }

    async changePhoto({ params, request, response }) {

      const photo = request.file('file', {
        maxSize: '2mb',
        allowedExtensions: ['jpg', 'png', 'jpeg']
      })

      if (!photo) {
        response.status(400).json({error:'File required!'})
        return
      }

      const user = await User.findOrFail(params.id)

      const name = `${user.id}/${Date.now()}_photo.${photo.extname}`

      await photo.move(Helpers.resourcesPath(uploadDir), {
        name,
        overwrite: true
      })

      if (!photo.moved()) {
        response.status(400).json({'error': photo.error()})
        return
      }

      user.photo = `${uploadDir}/${name}`

      await user.save()

      return user

    }

    async photo({ params, response }) {

      const user = await User.findOrFail(params.id)

      const content = await readFile(Helpers.resourcesPath(user.photo))

      response.header('Content-type', 'image/*').send(content)
      return

    }

}

module.exports = UserController