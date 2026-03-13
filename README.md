# Projeto de Extensão - Autenticação JWT com Criptografia e Assinatura

Este projeto é uma API REST desenvolvida para fins educativos, como parte de um projeto de extensão IV do curso de Engenharia de Software da faculdade Descomplica. O objetivo é mostrar o funcionamento de autenticação com JWT em aplicações web.

Ele demonstra:
- criação e validação de usuário;
- geração de token JWT (assinatura + criptografia);
- fluxo completo de login e validação;
- uso de Sequelize + SQLite para persistência local.

Pedro Mugnol

Bacharelado em Engenharia de Software

Faculdade Descomplica.

## 1. Introdução

O JWT (JSON Web Token) é um padrão aberto para troca segura de informações entre partes como um objeto JSON assinado. No caso de autenticação, o servidor gera um token assinado e opcionalmente criptografado após validar credenciais do usuário, e o cliente envia esse token em requisições subsequentes para autorizar acesso.

Componentes do JWT:
- header: tipo e algoritmo de assinatura;
- payload: informações (claims), como usuário e expiração;
- signature: assinatura com chave secreta ou par de chaves.

Este projeto usa JWT com:
- assinatura (`RS256`) para garantir integridade/autenticidade;
- criptografia (`RSA-OAEP-256` + `A256GCM`) para aumentar confidencialidade do token.

É uma implementação simples, didática, com foco no processo de:
1. registrar usuário;
2. login com credenciais;
3. geração de token assinado e criptografado;
4. validação e decriptação do token.

## 2. Estrutura do projeto

- `index.js`: ponto de entrada, configura `express`, `cors`, e rotas.
- `Dockerfile`: imagem para containerizar app (Node + app).
- `src/config/`:
  - `db.js`: configuração do Sequelize (SQLite).
  - `swagger.js`: setup Swagger.
- `src/controllers/`:
  - `userController.js`: handlers de usuários.
  - `authController.js`: handlers de autenticação e validação de token.
  - `index.js`: inicializa os handlers.
- `src/services/`:
  - `userService.js`: lógica de CRUD usuários.
  - `authService.js`: validação de usuário + geração e verificação de token.
  - `index.js`: inicializa serviços com modelo de usuário.
- `src/routes/`:
  - `userRoute.js`: rotas de consulta e cadastro de usuário
  - `authRoute.js`: rotas de login e validação de token.
  - `index.js`: registra rotas no `expressApp` e as mapeia para os handlers.
- `src/models/`:
  - `entity/user.js`: model Sequelize de usuário.
  - `dto/`: DTOs e validações para requests/responses.
- `src/middlewares/validationMiddleware.js`: aplica DTOs e validação de request.
- `src/middlewares/errorHandlerMiddleware.js`: interceptação de erro não tratado.
- `src/docs/openapi.yaml`: especificação OpenAPI.
- `keys/`: chaves RSA (não comitadas — geradas localmente).

## 3. Modelo de dados

### User (Sequelize)
- `id`: integer (PK, autoincrement).
- `userEmail`: string (único).
- `pwdHash`: string (hash bcrypt da senha).


## 4. Fluxo detalhado dos endpoints

1. `POST /users`:
   - valida os dados da requisição.
   - cria usuário gerando o hash da senha e salva no SQLite.
   - responde `201`.

2. `POST /login`:
   - valida os dados da requisição.
   - busca usuário pelo email.
   - compara a senha enviada com o hash salvo usando o bcrypt.
   - gera JWT assinado e criptografado.
   - responde `200` com o token gerado.

3. `POST /validate`:
   - valida o conteúdo da requisição.
   - descriptografa token.
   - verifica assinatura.
   - responde `200` se o token for válido, incluindo o payload interno do token para debug.

4. Rotas de usuário:
   - `GET /users`: retorna todos usuários.
   - `GET /users/:id`: retorna usuário por id.
   - `DELETE /users/:id`: remove um usuário.

5. Documentação Swagger:
   - `GET /docs`: interface Swagger UI para testar endpoints e visualizar schemas.

## 5. Variáveis de ambiente

Crie um arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```
- `NODE_PORT`: porta de escuta da API, p.ex. `3000`.
- `DB_FILE`: caminho do banco SQLite (opcional, quando o projeto suportar via env).

## 6. Como executar

Passo 1: gerar chaves RSA em `keys/`:
```bash
openssl genpkey -algorithm RSA -out keys/sign-private.pem -pkeyopt rsa_keygen_bits:2048 && openssl rsa -pubout -in keys/sign-private.pem -out keys/sign-public.pem

openssl genpkey -algorithm RSA -out keys/enc-private.pem -pkeyopt rsa_keygen_bits:2048 && openssl rsa -pubout -in keys/enc-private.pem -out keys/enc-public.pem
```

Passo 2: build e run com Podman:
```bash
podman build -t imagem-aplicacao .

podman run --rm --init -p 3000:3000 --name container-aplicacao imagem-aplicacao
```

Observação: se não usar Podman é possível rodar localmente com:
```bash
npm install
node index.js
```
