const mongoose = require('mongoose')

const url = process.env.MONGO_URI
console.log("connecting to ", url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongo db!')
    })
    .catch((error) => {
        console.log('error connect to mongoDB:', error.message)
    })

// kamu bisa menambahkan validasi pada schema
// fitur ini tersedia pada mongoose
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    important: Boolean,
})


// untuk menghapus field __v dan mengubah nama field _id menjadi id
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Note', noteSchema)