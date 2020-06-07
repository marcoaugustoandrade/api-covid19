const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const sexoSchema = new Schema({
    feminino: {
        type: Number,
        required: true
    },
    masculino: {
        type: Number,
        required: true
    },
    sigiloso: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
})

const Sexo = mongoose.model("Sexo", sexoSchema, "sexos")
module.exports = Sexo

