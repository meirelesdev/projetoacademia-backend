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

Route.get('/ping', () => {
  return { pong: 'Api Tudo ok' }
})

Route.get('/plans', 'PlanController.index')
Route.post('/plans', 'PlanController.store')

// Rota para criar um novo post  --VAI PRECISAR DE UM Middleware
Route.post('/admin/posts', 'PostController.store')
// Rota para editar um post -- VAI PRECISAR DE Um Middleware
Route.put('/admin/posts/:id', 'PostController.update')
// Rota para deletar um post -- VAI PRECISAR DE Um Middleware
Route.delete('/admin/posts/:id', 'PostController.destroy')
//Rota para listar todos os posts
Route.get('/posts', 'PostController.index')
// Rota para pegar a foto do post
Route.get('/posts/:id/photo', 'PostController.getPhotoPost')

// Rota para Mostrar um post especifico pelo id
Route.get('/posts/:id', 'PostController.show')

//Rotas para gallery
      // Esta rota é para salvar uma nova foto na galeria
      // Ela aceita recebe um title uma description e uma foto,
      // A foto é indispensavel os outros campos pode ser nullo
      /**********Essa ROTA VAI PRECISAR DE AUTENTICAÇÃO ******* */
Route.post('/admin/gallery', 'GalleryController.store')
// Rota para pegar uma foto
Route.get('/gallery/:id', 'GalleryController.getPhoto')

// Rota com todos os Registros do banco da tabela gallery
Route.get('/gallery', 'GalleryController.index')
// Rota para deletar Foto
Route.delete('/admin/gallery/:id', 'GalleryController.destroy')

//user routes
// Esta rota verifica se o usuario esta cadastrado no sistema
Route.post('/auths','AuthController.store')
// Esta rota registra um novo usuario
Route.post('/users','UserController.store')

// Rota para listar os usuarios registrados
Route.get('/admin/users', 'UserController.index')
//Rota para excluir um usuario
Route.delete('/admin/users/:id','UserController.destroy')
// Esta rota atualiza os dados do usuario
Route.put('/admin/users/:id', 'UserController.update')
// Rota para pegar um usuario
Route.get('/admin/users/:id', 'UserController.show')

// Rota para criar um novo treinamento
Route.post('/admin/training', 'TrainingController.store')
// Rota para editar um treinament
Route.put('/admin/trainings/:id', 'TrainingController.update')
// Rota para deletar um treinamento
Route.delete('/admin/training/:id', 'TrainingController.destroy')
//Rota para listar todos os treinamentos
Route.get('/training', 'TrainingController.index')
// Rota para pegar um treinamento
Route.get('/admin/trainings/:id', 'TrainingController.show')
// Rota para pegar um treinamento
Route.get('/trainings/:type_training', 'TrainingController.see')