const mongoose = require('mongoose')

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