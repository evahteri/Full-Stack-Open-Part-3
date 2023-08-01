require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', req => JSON.stringify(req.body))

const morganLogger = morgan('tiny', { skip: req => req.method === 'POST' })

const morganPOSTLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: req => req.method !== 'POST'
})

app.use(morganLogger)
app.use(morganPOSTLogger)


app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(
    person => {
      if (person) {
        response.json(person)} else {
        response.status(404).end()}}
  ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(
    () => {
      response.status(204).end()
    }
  ).catch(error => next(error))
}
)

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    const amount = people.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info for ${amount} people.</p> <br>
        ${currentTime}`)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }).then(
    updatedPerson => {
      response.json(updatedPerson)
    }
  ).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
}

)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})