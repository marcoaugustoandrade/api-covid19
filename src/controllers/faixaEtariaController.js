const redis = require('redis')
const FaixaEtaria = require('../models/FaixaEtaria')

const client = redis.createClient()

const atualizarCache = async () => {
    await FaixaEtaria.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
        .lean().exec((err, data) => {
            if (data){
                client.set("faixa-etaria", JSON.stringify(data))
            } else {
                client.del("faixa-etaria")
            }
        })
}

// Lista o último cadastrado
exports.listar = (req, res) => {

    try {

        client.get("faixaetaria", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/faixasetarias acessou o cache (Redis)')
            } else {
                FaixaEtaria.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
                    .then((dados) => {
                        if (dados){
                            res.status(200)
                            res.send(dados)
                            atualizarCache()
                            console.log('/faixasetarias acessou o banco (MongoDB)')
                        } else {
                            res.status(404)
                            res.send({message: "Nenhum dado sobre faixa etária cadastrada"})
                            console.log('/faixasetarias acessou o banco (MongoDB) sem dados')
                        }
                    })
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.inserir = (req, res) => {
    
    try {
        
        const leito = new FaixaEtaria({
            de0a9: req.body.de0a9,
            de10a19: req.body.de10a19,
            de20a29: req.body.de20a29,
            de30a39: req.body.de30a39,
            de40a49: req.body.de40a49,
            de50a59: req.body.de50a59,
            maisde60: req.body.maisde60,
            sigiloso:req.body.sigiloso,
            data: new Date()
        })
        leito.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Dados sobre faixas etárias inseridos com sucesso!'})
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {

    try {
        
        FaixaEtaria.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Dados sobre faixa etária deletados com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Dados sobre faixa etária não encontrados"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
