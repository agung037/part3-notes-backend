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

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

// app.get('/api/notes', (req, res) => {
//   res.json(notes)
// })

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

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})