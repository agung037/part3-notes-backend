const mongoose = require('mongoose')

const url = process.env.MONGO_URI
console.log("connecting to ", url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongo db')
    })
    .catch((error) => {
        console.log('error connect to mongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Note', noteSchema)