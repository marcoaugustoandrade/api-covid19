const redis = require('redis')
const Caso = require('../models/Caso')

const client = redis.createClient()

const atualizarCache = async () => {
    await Caso.find({})
        .lean().exec((err, data) => {
            if (data.length > 0){
                client.set("casos", JSON.stringify(data))
            } else {
                client.del("casos")
            }
        })
}

// Lista todos os casos
exports.listar = (req, res) => {

    try {

        client.get("casos", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/casos acessou o cache (Redis)')
            } else {
                Caso.find({})
                    .then((dados) => {
                        if (dados.length > 0){
                            res.status(200)
                            res.send(dados)
                            atualizarCache()
                            console.log('/casos acessou o banco (MongoDB)')
                        } else {
                            res.status(404)
                            res.send({message: "Nenhum dados sobre casos cadastrados"})
                            console.log('/casos acessou o banco (MongoDB) sem dados')
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

        // A data do caso é informada pela planilha
        // Nos outros casos a data é a data da criação
        const data = req.body.data.split('/')
        const nova_data =  new Date(data[2], (data[1] - 1), data[0])
        
        const leito = new Caso({
            dia: req.body.dia,
            data: nova_data,
            ativos: req.body.ativos,
            suspeitos: req.body.suspeitos,
            confirmados: req.body.confirmados,
            recuperados: req.body.recuperados,
            descartados: req.body.descartados,
            internados: req.body.internados,
            novos: req.body.novos,
            obitos: req.body.obitos
        })
        leito.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {

    try {
        
        if (req.params.id){
            Caso.findByIdAndDelete(req.params.id, (err,data) => {
                if (data){
                    atualizarCache()
                    res.status(200)
                    res.send({message: "Dados sobre casos deletados com sucesso!"})
                } else {
                    res.status(404)
                    res.send({message: "Dados sobre casos não encontrados"})
                }
            })
        } else {
            Caso.deleteMany((err, data) => {
                atualizarCache()
                res.status(200)
                res.send({message: "Dados sobre casos deletados com sucesso!"})
            })
        }
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

