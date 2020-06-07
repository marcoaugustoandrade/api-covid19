const bcrypt = require('bcrypt');
const saltRounds = 10;
const email = "user@gmail.com"
const senha = '#3QM4doe&63I';
const Usuario = require('./models/Usuario')


bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(senha, salt, (err, hash) => {
        const usuario = new Usuario({
            email: email,
            senha: hash
        })
        usuario.save((err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Usuário criado com sucesso')
            }
        })
    });
});