# Intruções para a instalação da API
sudo apt install node
git clone https://github.com/marcoaugustoandrade/api-covid19
cd api-covid19
npm install

# Configurando a API
Copie o arquivo `.env.example` para `.env`, para definir a porta da API, o secret e a URL do MongoDB.

# Criando usuário e senha da API
Edite o arquivo `src/gerar_senha.js`.
node src/gerar_senha.js

# Importando bairros e versão
===> mongo src/database/versoes.json
===> mongo src/database/bairros_vilhena.json

# Rodando manualmente a API
npm run start

# Rodando os testes
npm run test

# Gerenciando com o PM2
npm install pm2
pm2 start index.js
pm2 list

# Acessando a documentação da API
Para acessar a documentação abrar a url `https://<URL>:<PORTA>/api/v1/docs`.
