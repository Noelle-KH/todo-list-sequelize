const router = require('express').Router()
const todoController = require('../../controllers/todo-controller')

router.get('/', todoController.getTodos)
router.post('/', todoController.createTodo)
router.get('/new', todoController.newTodo)
router.get('/:id', todoController.getTodo)
router.get('/:id/edit', todoController.editTodo)
router.put('/:id', todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)

module.exports = router
