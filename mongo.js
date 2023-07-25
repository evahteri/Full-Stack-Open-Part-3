const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ras6e7z.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const personName = process.argv[3]

const personNumber = process.argv[4]


const person = new Person({
  name: personName,
  number: personNumber,
})

if (!personName && !personNumber) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}

if (personName && personNumber) {
    person.save().then(result => {
        console.log(personName, personNumber)
      console.log(`Added ${personName} ${personNumber} to phonebook`)
      mongoose.connection.close()
    })
}