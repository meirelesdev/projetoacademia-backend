'use strict'

const Post = use('App/Models/Post')
// importação da lib slug
const Slug = require('slug')

class PostController {
  
  // Lista todos os posts, funcao é chamada na rota /posts
  async index () {
    return await Post.all()
  }
  // Função para criar novo post
  async store ({ request }) {

      // table.string('title', 254).notNullable()
      // table.string('slug',254).notNullable()
      // table.text('body').notNullable()
      // table.string('photo', 254)
      // table.integer('author')
    // Espero receber, [title, body, photo, author] do frontend
    const dataPost = await request.only(['title','body','photo'])
    // Criando o slug do post
    dataPost.slug = Slug(dataPost.title)

    /**
     * Falta implementar o author antes de salvar
     */

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
    
    const post  = await Post.findOrFail(params.id)
    
    return post
  }

  async update ({ params, request }) {
    // Pegando no banco o post salvo
    const post = await Post.findOrFail(params.id)
    // Pegando os novos dados enviados
    const updatePost = request.only(['title','body','photo','author'])
    
    // comparando os titulos para fazer um novo slug
    if( post.title !== updatePost.title){
      // Usuario mudou o titulo, entao criamos um novo slug
      updatePost.slug = Slug(updatePost.title)
    }
    // Unimos os novos dados com os dados ja salvos
    post.merge(updatePost)
    // Salvamos novamente no banco
    await post.save()
    // Retornamos o novo post
    return post  
  }

  async destroy ({ params }) {

    const post = await Post.findOrFail(params.id)
    /*
    * Falta implementar segurança com middleware
    */
    
    await post.delete()

  }
}

module.exports = PostController
