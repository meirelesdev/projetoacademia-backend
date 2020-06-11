'use strict'

const Post = use('App/Models/Post')
const User = use('App/Models/User')
// importação da lib slug
const Slug = require('slug')
const Helpers = use('Helpers')
const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)
const uploadDir = 'photoposts'

class PostController {
  
  // Lista todos os posts, funcao é chamada na rota /posts
  async index ( { response } ) {
    
    const posts = await Post.all()
    // return await Post.all()

    response.send(posts)
  }
  // Função para criar novo post
  async store ({ request }) {

      // table.string('title', 254).notNullable()
      // table.string('slug',254).notNullable()
      // table.text('body').notNullable()
      // table.string('photo', 254)
      // table.integer('author')
    
      //o request.autho sera atribuido no frontend com o usuario que estiver logado
    const dataPost = request.only(['title','body', 'author', 'category'])

    //Aqui vamos buscar o criador do post no momento
      /**
     * Falta implementar o author antes de salvar
     *
     * 
     * /
    // dataPost.author = await User.findOrFail(dataPost.author)
      
    /**Salvando a imagem do post */
    const filePost = request.file('file', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    
    // 
    // A função new Date.now() nos dara uma combilação numerica que nao se repetira 
    // Fazendo com que cada arquivo tenha um nome diferente
    const name = `${Date.now()}_post.${filePost.extname}`
    // Aqui estamos movendo o arquivo da pasta temporaria para o servidor
    await filePost.move(Helpers.resourcesPath(uploadDir), {
      name,
      overwrite: true
    })
    // Verificando se o arquivo foi movido para a pasta 
    // para vc verificar, ele sera salvo em resources/photposts/nomedoarquivo
    if (!filePost.moved()) {
      // Caso nao, retorna um JSON com o erro
      response.status(400).json({'error': filePost.error()})
      return
    }
    // TERMINOU DE SALVAR A FOTO

    //Atribuindo o caminho da foto, para salvar no banco
    dataPost.photo = `${uploadDir}/${name}`
    
    // Criando o slug do post
    dataPost.slug = Slug(dataPost.title)

    // Salvando os dados no banco
    const post = await Post.create(dataPost)
    
    return post
  }

  async show ({ params, response }) {
    response.implicitEnd = false
    
    const post  = await Post.findOrFail(params.id)
    
    response.send(post)
  }

  async getPhotoPost({ params, response }) {
    // Pegamos o id passado no params pelo usuario
      // E pesquisamos no banco o registro com este nome
      const post = await Post.findOrFail(params.id)
        //pedimos para o noje ler dentro da pasta resources e ver se tem
        // Alguma fot com o nome registrado no banco caso tenha ele armazena o arquivo
    
      const content = await readFile(Helpers.resourcesPath(post.photo))
        //A qui temos a resposta sendo colocada no cadeçalho da resposta
      response.header('Content-type', 'image/*').send(content)  
  }

  async update ({ params, request }) {
    // Pegando no banco o post salvo
    const post = await Post.findOrFail(params.id)
    // Pegando os novos dados enviados
    const updatePost = request.only(['title','body','author', 'category'])
    // // Verificamos se foi alterado o titulo
    // if(updatePost.title === '' || updatePost.title === post.title ){
    //   updatePost.title = post.title
    //   // Usuario mudou o titulo, entao criamos um novo slug
    //   updatePost.slug = Slug(updatePost.title)
    // }
    // // Verificamos se foi alterado o texto do post'
    // if(updatePost.body === '' || updatePost.body === post.body ){
    //   updatePost.body = post.body
    // }
    // Pegamos o arquivos caso enviado
    const filePost = request.file('file', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    // Verificamos se foi enviado nova foton
      if(filePost){
            const name = `${Date.now()}_post.${filePost.extname}`
            // Aqui estamos movendo o arquivo da pasta temporaria para o servidor
            await filePost.move(Helpers.resourcesPath(uploadDir), {
              name,
              overwrite: true
            })
            // Verificando se o arquivo foi movido para a pasta 
            // para vc verificar, ele sera salvo em resources/photposts/nomedoarquivo
            if (!filePost.moved()) {
              // Caso nao, retorna um JSON com o erro
              response.status(400).json({'error': filePost.error()})
              return
            }
            // TERMINOU DE SALVAR A FOTO

            //Atribuindo o caminho da foto, para salvar no banco
            updatePost.photo = `${uploadDir}/${name}`
    }
    if(updatePost.author === '' || updatePost.author === post.author ){
      updatePost.author = post.author
    }
    if(updatePost.category === '' || updatePost.category === post.category ){
      updatePost.category = post.category
    }

    // Unimos os novos dados com os dados ja salvosbod
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
