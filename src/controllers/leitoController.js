const redis = require('redis')
const Leito = require('../models/Leito')

const client = redis.createClient()

const atualizarCache = async () => {
    await Leito.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
        .lean().exec((err, data) => {
            if (data){
                client.set("leito", JSON.stringify(data))
            } else {
                client.del("leito")
            }
        })
}

// Lista o último cadastrado
exports.listar = (req, res) => {

    try {

        client.get("leito", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/leitos acessou o cache (Redis)')
            } else {
                Leito.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
                    .then((dados) => {
                        if (dados){
                            res.status(200)
                            res.send(dados)
                            atualizarCache()
                            console.log('/leitos acessou o banco (MongoDB)')
                        } else {
                            res.status(404)
                            res.send({message: "Nenhum dado sobre leitos cadastrado"})
                            console.log('/leitos acessou o banco (MongoDB) sem dados')
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
        
        const leito = new Leito({
            uti: req.body.uti,
            uti_utilizadas: req.body.uti_utilizadas,
            enfermarias: req.body.enfermarias,
            enfermarias_utilizadas: req.body.enfermarias_utilizadas,
            data: new Date()
        })
        leito.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Dados sobre leitos inseridos com sucesso!'})
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {

    try {
        
        Leito.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Dados sobre leito deletados com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Dados sobre leitos não encontrados"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
