const redis = require('redis')
const Sexo = require('../models/Sexo')

const client = redis.createClient()

const atualizarCache = async () => {
    await Sexo.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
        .lean().exec((err, data) => {
            if (data){
                client.set("sexo", JSON.stringify(data))
            } else {
                client.del("sexo")
            }
        })
}

// Lista o último cadastrado
exports.listar = (req, res) => {
    
    try {

        client.get("sexo", (err, data) => {
            if (data){
                res.status(200)
                res.send(JSON.parse(data))
                console.log('/sexos acessou o cache (Redis)')
            } else {
                Sexo.findOne({}).sort({ field: 'asc', _id: -1 }).limit(1)
                    .then((dados) => {
                        if (dados){
                            res.status(200)
                            res.send(dados)
                            atualizarCache()
                            console.log('/sexos acessou o banco (MongoDB)')
                        } else {
                            res.status(404)
                            res.send({message: "Nenhum dado sobre sexo cadastrado"})
                            console.log('/sexos acessou o banco (MongoDB) sem dados')
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
        
        const sexo = new Sexo({
            feminino: req.body.feminino,
            masculino: req.body.masculino,
            sigiloso: req.body.sigiloso,
            data: new Date()
        })
        sexo.save((err, data) => {
            atualizarCache()
            res.status(201)
            res.send(data)
            // res.send({message: 'Dados sobre sexo inseridos com sucesso!'})
        })

    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}

exports.deletar = (req, res) => {
    
    try {
        
        Sexo.findByIdAndDelete(req.params.id, (err,data) => {
            if (data){
                atualizarCache()
                res.status(200)
                res.send({message: "Dados sobre sexo deletdos com sucesso!"})
            } else {
                res.status(404)
                res.send({message: "Dados sobre sexo não encontrados"})
            }
        })
    } catch (err) {
        res.status(500)
        res.send({message: err.message})
    }
}
