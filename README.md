# 💻 Sistema de locação de carros

## Descrição

Esse projeto tem como objetivo criar uma API simulando um sistema da empresa CompassCar que possui funcionalidades desde o cadastramento de usuários, clientes e carros até a criação e gerenciamento de pedidos

## Como executar o projeto em sua maquina local?

-   Utilizando no terminal o comando `git clone` git@github.com:kauamoro/Sistema_de_locacao_de_carros.git crie uma cópia desse projeto em seu repositório local
-   Instale as dependências necessárias utilizando o comando `npm install`
-   Inicie o seu MySQL e configure a conexão do sequelize ao seu usuário.
-   Em seu terminal utilize nessa ordem as seguintes linhas de comando:

1. npx sequelize db:create -> crie o banco de dados em sua máquina a partir do arquivo de configuração.
2. npx sequelize db:migrate -> execute as migrações existentes.
3. npx sequelize-cli db:seed:all -> execute as seeds para criar um usuário teste no banco de dados.

-   Execute o projeto utilizando o comando `npm run dev` no terminal.

## Como executar o projeto em uma instancia EC2?

### Pré-requisitos

- Conta na AWS: Você deve ter acesso ao console da AWS.
- Instância EC2 configurada: Instância com sistema operacional - Linux (recomendado Ubuntu ou Amazon Linux 2) configurada com o Security Group liberando as portas 22 (SSH) e 3000 (aplicação).
- Chave de acesso SSH: Certifique-se de que você pode acessar a instância via SSH.
- Node.js: Node.js e NPM instalados na instância.
- Docker e Docker Compose: Instalados e configurados na instância EC2.

1. ssh -i "sua-chave.pem" ubuntu@seu-endereco-ip -> No terminal, acesse a instância utilizando a chave SSH
2. git clone git@github.com:kauamoro/Sistema_de_locacao_de_carros.git -> Dentro da instância, clone o repositório do projeto
3. docker-compose up -d -> Inicie o projeto utilizando este comando.
4. Executar migrações e seeds
- docker exec -it <nome_do_container_da_api> npx sequelize db:create
- docker exec -it <nome_do_container_da_api> npx sequelize db:migrate
- docker exec -it <nome_do_container_da_api> npx sequelize-cli db:seed:all
4.1 OBS: Substitua <nome_do_container_da_api> pelo nome do container da API, que pode ser encontrado com o comando: 'docker ps'

5. http://seu-endereco-ip:3000 -> Acesse a API
5.1 OBS: Coloque seu endereco-ip em 'seu-endereco-ip'

## Tecnologias utilizadas

-   Node.js
-   NPM
-   Express
-   Sequelize
-   MySQL
-   Typescript
-   Axios
-   Jswonwebtoken
-   Celebrate
-   Bcrypt
-   Eslint
-   Docker e Docker Compose
-   Axios

## ROTAS

-   Login: `/api/v1/login`
-   Usuários: `/api/v1/users`
-   Clientes: `/api/v1/customers`
-   Carros: `/api/v1/cars`
-   Pedidos: `/api/v1/Order`
