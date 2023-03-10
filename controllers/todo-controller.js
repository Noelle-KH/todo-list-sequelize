const { v4: uuidv4 } = require('uuid')
const { Todo } = require('../models')

const todoController = {
  getTodos: async (req, res, next) => {
    const userId = req.user.id

    try {
      const todos = await Todo.findAll({
        where: { userId },
        raw: true,
        nest: true,
        order: [['name', 'ASC']]
      })

      if (!todos.length) {
        return res.render('index')
      }

      res.render('index', { todos })
    } catch (error) {
      next(error)
    }
  },
  newTodo: (req, res) => {
    res.render('new')
  },
  createTodo: async (req, res, next) => {
    const userId = req.user.id
    const { name, isDone } = req.body

    if (!name) {
      req.flash('Please enter todo event.')
      return res.render('new', { name, isDone })
    }

    try {
      await Todo.create({ id: uuidv4(), name, isDone, userId })
      req.flash('success_message', 'Create successfully.')
      res.redirect('/todos')
    } catch (error) {
      next(error)
    }
  },
  getTodo: async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id

    try {
      const todo = await Todo.findOne({ where: { id, userId } })
      res.render('detail', { todo: todo.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  editTodo: async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id

    try {
      const todo = await Todo.findOne({ where: { id, userId } })
      res.render('edit', { todo: todo.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  updateTodo: async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id
    const { name, isDone } = req.body

    try {
      await Todo.update({ name, isDone: `${isDone === 'on'}` }, { where: { id, userId } })
      req.flash('success_message', 'Update successfully.')
      res.redirect(`/todos/${id}`)
    } catch (error) {
      next(error)
    }
  },
  deleteTodo: async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id

    try {
      await Todo.destroy({ where: { id, userId } })
      req.flash('success_message', 'Delete successfully.')
      res.redirect('/todos')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = todoController
