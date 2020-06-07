const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Usuario = require('../models/Usuario')
require('dotenv').config()

exports.login = (req, res) => {

    const email = req.body.email
    const senha = req.body.senha

    Usuario.findOne({email: email})
        .then((dados) => {
            if (dados){
                bcrypt.compare(senha, dados.senha, (err, resp) => {
                    if (resp){
                        jwt.sign({email}, process.env.SECRET, {expiresIn: 3000}, (err, token) => {
                            res.status(200)
                            res.json({"auth": true, "token": token})
                        })
                    } else {
                        res.status(403)
                        res.json({"auth": false, "message": "E-mail ou senha incorretos"})
                    }
                })
            } else {
                res.status(404)
                res.send({message: "Email ou senha incorretos"})
            }
        })
}

exports.verificar = (req, res, next) => {
    
    const token = req.headers['access-token']

    if (!token){
      res.status(401)
      res.send({"auth": false, "message": "Token em branco"})
    } else {
      jwt.verify(token, process.env.SECRET, (err, decode) => {
        if (err){
          res.status(403)
          res.send({"auth": false, "message": "Falha de autenticação"})
        } else {
          next()
        }
      })
    }
}
