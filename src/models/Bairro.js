const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const bairroSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    casos_ativos: {
        type: Number,
        required: true
    },
    coordenadas: {
        type: Array
    },
    data: {
        type: Date,
        required: true
    }
})

const Bairro = mongoose.model("Bairro", bairroSchema, "bairros")
module.exports = Bairro

