const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const leitoSchema = new Schema({
    uti: {
        type: Number,
        required: true
    },
    uti_utilizadas: {
        type: Number,
        required: true
    },
    enfermarias: {
        type: Number,
        required: true
    },
    enfermarias_utilizadas: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
})

const Leito = mongoose.model("Leito", leitoSchema, "leitos")
module.exports = Leito

