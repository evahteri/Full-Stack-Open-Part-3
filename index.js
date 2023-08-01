require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('body', req => JSON.stringify(req.body))
app.use(cors())

const morganLogger = morgan('tiny', { skip: req => req.method === 'POST' })

const morganPOSTLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: req => req.method !== 'POST'
})

app.use(express.static('build'))
app.use(express.json())
app.use(morganLogger)
app.use(morganPOSTLogger)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
      }
]


app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    const person = Person.findById({id}).then(
        person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        }
    ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(
        result => {
            response.status(204).end()
        }
    ).catch(error => next(error))
}
)

const countItems = () => {
    return persons.length
}

app.get('/info', (req, res) => {
    amount = countItems()
    currentDate = new Date()
    res.send(`<p>Phonebook has info for ${amount} people</p>
    <p>${currentDate}</p>`)
})

app.post('/api/persons', (request, response) => {
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
    
    /*
    
    const oldName = persons.find(person => person.name === body.name)
    if (oldName) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    
    */

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
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})