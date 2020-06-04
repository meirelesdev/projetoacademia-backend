'use strict'

const Post = use('App/Models/Post')

class PostController {
  
  // Lista todos os posts, funcao é chamada na rota /posts
  async index () {
    return await Post.all()
  }
  // Função para criar novo post
  async store ({ request }) {
    // Espero receber, [title, body, photo, author] do frontend
    const dataPost = await request.only(['title','body','photo','author'])
    // Salvando os dados no banco
    const post = await Post.create(dataPost)
    
    return post
  }
// Recebe o id do post como parametro pela URl
/**
 *  Implementar slug para usar no parametro pois em um blog
 *  normalmente se usa o titulo do post como url
 */
  async show ({ params }) {
    // Verificar a posibilidade de usar o slug para pesquisas
    const post  = await Post.findOrFail(params.id)
    
    return post
  }

  async update ({ params, request, response }) {
  
  }

  async destroy ({ params, request, response }) {
  
  }
}

module.exports = PostController
