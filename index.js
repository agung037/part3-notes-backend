require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const Note = require('./models/note')
const res = require('express/lib/response')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})


// GET Query using mongodb atlas
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})


// POST query using mongodb atlas
app.post('/api/notes', (request, response) => {
  const body = request.body

  // memastikan user menulis content
  if(body.content === undefined){
    return response.status(400).json({error: 'content missing'})
  }

  // membentuk note baru dalam bentuk object
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })

})

// Query specific notes by id
app.get('/api/notes/:id', (request, response, next) => {
  // findById is method from mongoose
  Note.findById(request.params.id)
    .then(note => {
    // jika ditemukan maka krim response
    if(note){
      response.json(note)
    }else{
      // jika tidak maka berikan error 404
      response.status(404).end()
    }
  })
  .catch(error => next(error))

})


// Update specific note
app.put('/api/notes/:id', (request, response, next) => {

  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
  .then(updatedNote => {
    response.json(updatedNote)
  })
  .catch(error => next(error))
})


// Deleting specific notes by id
app.delete('/api/notes/:id', (request, response, next) => {

  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

})


// error handler ala express yang selalu diletakan di bawah semua route
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformated id'})
  }

  next(error)
}


app.use(errorHandler)

// runing server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})