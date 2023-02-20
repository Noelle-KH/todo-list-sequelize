const router = require('express').Router()
const { Todo } = require('../../models')

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({ raw: true, nest: true })
    if (!todos.length) {
      return res.render('index')
    }
    res.render('index', { todos })
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const todo = await Todo.findByPk(id)
    res.render('detail', { todo: todo.toJSON() })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
