const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const versaoSchema = new Schema({
    versao: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
})

const Versao = mongoose.model("Versao", versaoSchema, "versoes")
module.exports = Versao
