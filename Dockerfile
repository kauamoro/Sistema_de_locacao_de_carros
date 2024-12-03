# Etapa 1: Escolher a imagem base com Node.js
FROM node:18-alpine

# Etapa 2: Definir o diretório de trabalho dentro da imagem
WORKDIR /app

# Etapa 3: Copiar os arquivos do projeto para o diretório da imagem
COPY package*.json ./

# Etapa 4: Instalar as dependências do projeto
RUN npm install

# Etapa 5: Copiar o restante dos arquivos do projeto
COPY . .

# Etapa 6: Expor a porta que será usada pela aplicação
EXPOSE 3000

# Etapa 7: Comando para iniciar a aplicação
CMD ["npm", "run", "start"]

RUN apk add --no-cache mysql-client
