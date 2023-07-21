const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        content: "Arto Hellas",
        important: "040-123456"
      },
      {
        id: 2,
        content: "Ada Lovelace",
        important: "39-44-5323523"
      },
      {
        id: 3,
        content: "Dan Abramov",
        important: "12-43-234345"
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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})