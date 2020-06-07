const redis = require('redis')
const Versao = require('../models/Versao')

const client = redis.createClient()

const atualizarCache = async () => {
    await Versao.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
        .lean().exec((err, data) => {
            if (data){
                client.set("versao", JSON.stringify(data))
            } else {
                client.del("versao")
            }
    })
}

// Lista o último cadastrado
exports.listar = (req, res) => {
    
    try {

        client.get("versao", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/versoes acessou o cache (Redis)')
            } else {
                Versao.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
                .then((dados) => {
                    if (dados){
                        res.status(200)
                        res.send(dados)
                        atualizarCache()
                        console.log('/versoes acessou o banco (MongoDB)')
                    } else {
                        res.status(404)
                        res.send({message: "Nenhuma versão cadastrada"})
                        console.log('/versoes acessou o banco (MongoDB) sem dados')
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
        
        const versao = new Versao({
            versao: req.body.versao,
            data: new Date()
        })
        versao.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Versão inserida com sucesso!'})
        })

    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.alterar = (req, res) => {
    
    try {
        
        const nova_versao = {
            versao: req.body.versao,
            data: new Date()
        }
        
        Versao.findByIdAndUpdate(req.params.id, nova_versao, (err, data) => {
            atualizarCache()
            res.status(200)
            res.send(data)
            // res.send({message: 'Versão alterada com sucesso!'})
        })

    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {
    
    try {
        
        Versao.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Versão deletada com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Versão não encontrada"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
