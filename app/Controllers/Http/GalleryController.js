'use strict'

const Gallery = use('App/Models/Gallery')
// Helpers sera usado para manipular arquivos 
const Helpers = use('Helpers')
// Este é um modulo interno do node para escrever arquivos no servidor
const fs = use('fs')
// Esta constante ainda nao sei bem para que serve mas acredito que é o metodo do fs
// que realmente este o arquivo no servidor
const readFile = Helpers.promisify(fs.readFile)
// Pasta onde sera salvo os arquivos
const uploadDir = 'gallery'

class GalleryController {

  async index ( { response } ) {
  // Constante que vai receber a lista de todos os registro da tabela gallery  
    const galleryList = await Gallery.all()

    // Enviando para o frontend a lista dos registros
    response.send(galleryList)

  }

  async store ({ request, response }){
    /**ESPERO RECEBERESTES CAMPOS AO CADASTRAR UMA FOTO */
    // string('title',254)
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
    const name = `${Date.now()}_gallery.${filePhoto.extname}`
    // Aqui estamos movendo o arquivo da pasta temporaria para o servidor
    await filePhoto.move(Helpers.resourcesPath(uploadDir), {
      name,
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
    data.url = `${uploadDir}/${name}`
    // Aqui pedimos para o adonis salvar um novo registro na tabela gallery
    // e retorna-lo para a constante photo
    const photo = await Gallery.create(data)
    // entao finalmente retornamos o novo registro
    return photo
  }

  // Este metodo é chamado para pegar uma foto 
  async getPhoto({ params, response }) {
      // Pegamos o id passado no params pelo usuario
      // E pesquisamos no banco o registro com este nome
      const photo = await Gallery.findOrFail(params.id)
        //pedimos para o noje ler dentro da pasta resources e ver se tem
        // Alguma fot com o nome registrado no banco caso tenha ele armazena o arquivo
    
      const content = await readFile(Helpers.resourcesPath(photo.url))
        //A qui temos a resposta sendo colocada no cadeçalho da resposta
      response.header('Content-type', 'image/*').send(content)  

  }

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
