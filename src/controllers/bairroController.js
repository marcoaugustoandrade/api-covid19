const redis = require('redis')
const Bairro = require('../models/Bairro')

const client = redis.createClient()

const atualizarCache = async () => {
    await Bairro.find({})
        .lean().exec((err, data) => {
            if (data.length > 0){
                client.set("bairros", JSON.stringify(data))
            } else {
                client.del("bairros")
            }
        })
}

// Lista todos os bairros
exports.listar = (req, res) => {

    try {

        client.get("bairros", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/bairros acessou o cache (Redis)')
            } else {
                Bairro.find({})
                    .then((dados) => {
                        if (dados.length > 0){
                            res.status(200)
                            res.send(dados)
                            atualizarCache()
                            console.log('/bairros acessou o banco (MongoDB)')
                        } else {
                            res.status(404)
                            res.send({message: "Nenhum dados sobre bairros cadastrados"})
                            console.log('/bairros acessou o banco (MongoDB) sem dados')
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
        
        const bairro = new Bairro({
            nome: req.body.nome,
            casos_ativos: req.body.casos_ativos,
            coordenadas: req.body.coordenadas,
            data: new Date()
        })
        bairro.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Bairro inserido com sucesso!'})
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.alterar = (req, res) => {
    
    try {
        
        const novo_bairro = {
            nome: req.body.nome,
            casos_ativos: req.body.casos_ativos,
            coordenadas: req.body.coordenadas,
            data: new Date()
        }
        
        Bairro.findByIdAndUpdate(req.params.id, novo_bairro, (err, data) => {
            atualizarCache()
            res.status(200)
            res.send(data)
            // res.send({message: 'Bairro alterado com sucesso!'})
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {

    try {
        
        Bairro.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Bairro deletado com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Bairro não encontrado"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
