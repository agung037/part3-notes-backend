const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
    await Note.deleteMany({})

    const noteObject = helper.initialNotes
        .map(note => new Note(note))
        const promiseArray = noteObject.map(note => note.save())
        await Promise.all(promiseArray)
})


describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
          .get('/api/notes')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      }, 100000)

    test('returning initial data with two notes length', async () => {
        const response = await api.get('/api/notes')
    
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
    

    test('all notes returned', async () => {
        const response = await api.get('/api/notes')
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(r => r.content)
      
        expect(contents).toContain(
          'Browser can execute only Javascript'
        )
      })

})


describe('viewing a specific note', () => {

    test('view first note, about HTTP methods', async () => {
        const response = await api.get('/api/notes')
    
        expect(response.body[0].content).toBe('HTML is easy')
    })

    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb()

        const noteToView = notesAtStart[0]

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

        expect(resultNote.body).toEqual(processedNoteToView)
    })


    test('fails acessing non existing notes, returned 404', async () => {
        const nonExistingId = '5a3d5da59070081a82a3445'

        const resultNote = await api 
            .get(`/api/notes/${nonExistingId}`)
            .expect(400)

        expect(resultNote.body.error).toEqual("malformated id")
    })
    
})


describe('adding a new note', () => {

          
    test('sucess added new note with valid data', async () => {
        const newNote = {
            content: 'async/await is good to make code cleaner',
            important: true,
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        
      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      expect(contents).toContain(
          'async/await is good to make code cleaner'
      )
    })

  
    test('fails with status code 400 if data invaild', async () => {
        const newNote = {
            important: true
        }

        await api 
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()
        
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })

})

describe('deletion of a notes', () => {

    test('succeeds with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)
        
        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        )

        const contents = notesAtEnd.map(r => r.content)

        expect(contents).not.toContain(noteToDelete.content)
    })

})



afterAll(() => {
  mongoose.connection.close()
})