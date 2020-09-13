'use strict'

const User = use('App/Models/User.js')

class AuthController {

    async store({request,response, auth}) {
        //Aqui ele retorna uma string
        const { email, password } = request.all()
        // Aqui ele retorna um objeto com a key email
        const emails = request.only('email')
        // console.log("O email é: ", email)
        // console.log("O emails é: ", emails)
        const user = await User.findByOrFail(emails)
        const token = await auth.attempt(email, password)

        return {user, token}
    }

    async profile({ auth, response }) {
        const user = await auth.getUser()
        
        return user
    }
    
}

module.exports = AuthController
