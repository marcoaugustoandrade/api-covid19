const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

// Versão da API
const api_version = process.env.API_VERSION

// Importando as rotas
const router = require('./routes')
app.use(`/api/${api_version}`, router)

// Documentação da API
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/swagger.yaml')
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
