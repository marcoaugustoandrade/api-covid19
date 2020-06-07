const mongoose = require('../database/conexao')
const Schema = mongoose.Schema

const faixaEtariaSchema = new Schema({
    de0a9: {
        type: Number,
        required: true
    },
    de10a19: {
        type: Number,
        required: true
    },
    de20a29: {
        type: Number,
        required: true
    },
    de30a39: {
        type: Number,
        required: true
    },
    de40a49: {
        type: Number,
        required: true
    },
    de50a59: {
        type: Number,
        required: true
    },
    maisde60: {
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

const FaixaEtaria = mongoose.model("FaixaEtaria", faixaEtariaSchema, "faixasetarias")
module.exports = FaixaEtaria

