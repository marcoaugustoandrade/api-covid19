const express = require('express')
const router = express.Router()

const bairroController = require('./controllers/bairroController')
const casoController =require('./controllers/casoController')
const faixaEtariaController = require('./controllers/faixaEtariaController')
const leitoController = require('./controllers/leitoController')
const sexoController = require('./controllers/sexoController')
const totalizadorController = require('./controllers/totalizadorController')
const versaoController = require('./controllers/versaoController')
const autenticacaoController = require('.//controllers/autenticacaoController')

// TODO: filtrar por casos ativos
// TODO: implementar filtro por id
router.get('/bairros/:nome?', bairroController.listar)
router.post('/bairros', autenticacaoController.verificar, bairroController.inserir)
router.put('/bairros/:id', autenticacaoController.verificar, bairroController.alterar)
router.delete('/bairros/:id', autenticacaoController.verificar, bairroController.deletar)

router.get('/casos', casoController.listar)
router.post('/casos', autenticacaoController.verificar, casoController.inserir)
router.delete('/casos/:id?', autenticacaoController.verificar, casoController.deletar)

router.get('/faixasetarias', faixaEtariaController.listar)
router.post('/faixasetarias', autenticacaoController.verificar, faixaEtariaController.inserir)
router.delete('/faixasetarias/:id', autenticacaoController.verificar, faixaEtariaController.deletar)

router.get('/leitos', leitoController.listar)
router.post('/leitos', autenticacaoController.verificar, leitoController.inserir)
router.delete('/leitos/:id', autenticacaoController.verificar, leitoController.deletar)

router.get('/sexos', sexoController.listar)
router.post('/sexos', autenticacaoController.verificar, sexoController.inserir)
router.delete('/sexos/:id', autenticacaoController.verificar, sexoController.deletar)

router.get('/totalizadores', totalizadorController.listar)
router.post('/totalizadores', autenticacaoController.verificar, totalizadorController.inserir)
router.delete('/totalizadores/:id', autenticacaoController.verificar, totalizadorController.deletar)

router.get('/versoes', versaoController.listar)
router.post('/versoes', autenticacaoController.verificar, versaoController.inserir)
router.put('/versoes/:id', autenticacaoController.verificar, versaoController.alterar)
router.delete('/versoes/:id', autenticacaoController.verificar, versaoController.deletar)

router.post('/login', autenticacaoController.login)

module.exports = router
