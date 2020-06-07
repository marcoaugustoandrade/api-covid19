const redis = require('redis')
const Totalizador = require('../models/Totalizador')

const client = redis.createClient()

const atualizarCache = async () => {
    await Totalizador.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
        .lean().exec((err, data) => {
            if (data){
                client.set("totalizador", JSON.stringify(data))
            } else {
                client.del("totalizador")
            }
        })
}

// Lista o último cadastrado
exports.listar = (req, res) => {
    
    try {

        client.get("totalizador", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/totalizadores acessou o cache (Redis)')
            } else {
                Totalizador.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
                .then((dados) => {
                    if (dados){
                        res.status(200)
                        res.send(dados)
                        atualizarCache()
                        console.log('/totalizadores acessou o banco (MongoDB)')
                    } else {
                        res.status(404)
                        res.send({message: "Nenhum totalizador cadastrado"})
                        console.log('/totalizadores acessou o banco (MongoDB) sem dados')
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
        
        const totalizador = new Totalizador({
            ativos: req.body.ativos,
            suspeitos: req.body.suspeitos,
            confirmados: req.body.confirmados,
            recuperados: req.body.recuperados,
            descartados: req.body.descartados,
            internados: req.body.internados,
            novos: req.body.novos,
            obitos: req.body.obitos,
            data: new Date()
        })
        totalizador.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Totalizador inserido com sucesso!'})
        })

    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.alterar = (req, res) => {
    
}

exports.deletar = (req, res) => {
    
    try {
        
        Totalizador.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Totalizador deletado com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Totalizador não encontrado"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
