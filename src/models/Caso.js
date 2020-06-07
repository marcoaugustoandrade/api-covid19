const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const casoSchema = new Schema({
    dia: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    ativos: {
        type: Number,
        required: true
    },
    suspeitos: {
        type: Number,
        required: true
    },
    confirmados: {
        type: Number,
        required: true
    },
    recuperados: {
        type: Number,
        required: true
    },
    descartados: {
        type: Number,
        required: true
    },
    internados: {
        type: Number,
        required: true
    },
    novos: {
        type: Number,
        required: true
    },
    obitos: {
        type: Number,
        required: true
    }
})

const Caso = mongoose.model("Caso", casoSchema, "casos")
module.exports = Caso

