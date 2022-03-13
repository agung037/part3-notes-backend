require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const Note = require('./models/note')

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
app.get('/api/notes/:id', (request, response) => {
  // findById is method from mongoose
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})


// Deleting specific notes by id
app.delete('/api/notes/:id', (request, response) => {

  // menemukan notes yang ingin dihapus berdasarkan id
  Note.findById(request.params.id).then(note => {
    // setelah ketemu, hapus post tersebut
    note.remove() 
    // tampilkan hasilnya
    response.json({"report" : `note with id ${request.params.id} deleted !`})
  })
})


// runing server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})