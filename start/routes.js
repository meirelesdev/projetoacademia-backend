'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

//Rota para listar todos os posts
Route.get('/posts', 'PostController.index')
// Rota para pegar a foto do post
Route.get('/posts/:id/photo', 'PostController.getPhotoPost')
// Rota para Mostrar um post especifico
Route.get('/posts/:id', 'PostController.show')
// Rota para criar um novo post  --VAI PRECISAR DE UM Middleware
Route.post('/admin/posts', 'PostController.store')
// Rota para editar um post -- VAI PRECISAR DE Um Middleware
Route.put('/admin/posts/:id', 'PostController.update')
// Rota para deletar um post -- VAI PRECISAR DE Um Middleware
Route.delete('/admin/posts/:id', 'PostController.destroy')

//Rotas para gallery
      // Esta rota é para salvar uma nova foto na galeria
      // Ela aceita recebe um title uma description e uma foto,
      // A foto é indispensavel os outros campos pode ser nullo
      /**********Essa ROTA VAI PRECISAR DE AUTENTICAÇÃO ******* */
Route.post('/admin/gallery', 'GalleryController.store')
// Rota para pegar uma foto
Route.get('/gallery/:id', 'GalleryController.getPhoto')


