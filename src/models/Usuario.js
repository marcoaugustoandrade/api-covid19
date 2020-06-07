const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const usuarioSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios")
module.exports = Usuario