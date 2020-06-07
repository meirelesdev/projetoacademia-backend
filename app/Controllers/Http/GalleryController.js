'use strict'

const Gallery = use('App/Models/Gallery')
// Helpers sera usado para manipular arquivos 
const Helpers = use('Helpers')
// Este é um modulo interno do node para escrever arquivos no servidor
const fs = use('fs')
// Esta constante ainda nao sei bem para que serve mas acredito que é o metodo do fs
// que realmente este o arquivo no servidor
const readFile = Helpers.promisify(fs.readFile)

const uploadDir = 'gallery'

class GalleryController {

  async index ({ request, response, view }) {
  }
  async savePhoto({ request }){
 
  }
  async store ({ request, response }){
    /**ESPERO RECEBERESTES CAMPOS AO CADASTRAR UMA FOTO */
    // string('title',254).notNullable()
    // string('description',254)
    /** O CAMPO URL SERA PREENCHIDO QUANDO A FOTO FOR SALVA */
    // string('url',254).notNullable().unique()
    
    // Aqui estamos pegando somente o title e a description,
    // Pois o arquivo vamos tratar e salvar e depois enviar para o data.url o caminho dele
    
    const data = request.only(['title','description'])
   // SALVANDO A FOTO
    // Aqui estamos pegando o arquivo enviado e ja verificando se é imagem mesmo
    // tambem estamos restringindo seu tamanho em 2mb
    const filePhoto = request.file('file', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    // Neste if verificamos se o arquivos passo pelos requisitos a cima
    if (!filePhoto) {
      // Caso nao a resposta sera um json com este error
      response.status(400).json({error:'File required!'})
      return
    } 
    // Apos passar a verificação acima criamos um nome para o arquivo
    // A função new Date.now() nos dara uma combilação numerica que nao se repetira 
    // Fazendo com que cada arquivo tenha um nome diferente
    const fileName = `${ Date.now() }_gallery.${filePhoto.extname}`
    // Aqui estamos movendo o arquivo da pasta temporaria para o servidor
    await filePhoto.move(Helpers.resourcesPath(uploadDir), {
      fileName,
      overwrite: true
    })
    // Verificando se o arquivo foi movido para a pasta 
    // para vc verificar ele sera salvo em resources/gallery/nomedoarquivo
    if (!filePhoto.moved()) {
      // Caso nao retorna um JSON com o erro
      response.status(400).json({'error': filePhoto.error()})
      return
    }
    // TERMINOU DE SALVAR A FOTO
    
    // apos salvar o arquivo ja temos o caminho dele entao podemos adicionar a url no data
    data.url = `${uploadDir}/${fileName}`
    // Aqui pedimos para o adonis salvar um novo registro na tabela gallery
    // e retorna-lo para a constante photo
    const photo = await Gallery.create(data)
    // entao finalmente retornamos o novo registro
    return photo
  }

  // async photo({ params, response }) {
    async show({ params, response }) {
      
    const photo = await Gallery.findOrFail(params.id)

    const content = await readFile(Helpers.resourcesPath(photo.url))

    response.header('Content-type', 'image/*').send(content)
    return

  }

  /**
   * Render a form to be used for creating a new gallery.
   * GET galleries/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Display a single gallery.
   * GET galleries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing gallery.
   * GET galleries/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update gallery details.
   * PUT or PATCH galleries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a gallery with id.
   * DELETE galleries/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = GalleryController
