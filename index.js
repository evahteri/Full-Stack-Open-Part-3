const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', req => JSON.stringify(req.body))

const morganLogger = morgan('tiny', { skip: req => req.method === 'POST' })

const morganPOSTLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: req => req.method !== 'POST'
})

app.use(express.json())
app.use(morganLogger)
app.use(morganPOSTLogger)

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
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
}
)

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
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

const generateId = () => {
    const number = Math.floor(Math.random()*1000)
    return number
}

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
    
    const oldName = persons.find(person => person.name === body.name)
    if (oldName) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }

    const id = generateId()
    console.log(id)

    const person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person)

    response.json(person)
}
)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})