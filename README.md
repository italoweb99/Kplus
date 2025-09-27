# Kplus

## Objetivo
O Kplus é uma plataforma de streaming de vídeos (filmes e séries) que oferece uma experiência personalizada para o usuário, incluindo histórico, favoritos, controle de progresso, múltiplos perfis e recomendações inteligentes. O sistema foi desenvolvido para ser escalável, seguro e de fácil manutenção, utilizando boas práticas de arquitetura e tecnologias modernas.

## Tecnologias Utilizadas

### Back-end
- **Node.js**
- **Express.js**
- **JWT (JSON Web Token)** para autenticação
- **pg** (PostgreSQL driver)


### Front-end
- **React.js** (com Vite)
- **TypeScript**
- **Axios**
- **React Router DOM**
- **Tailwind CSS**

### Banco de Dados
- **PostgreSQL**
- Modelagem relacional com tabelas para usuários, filmes, séries, temporadas, episódios, histórico, favoritos, etc.

### Criptografia
- **bcrypt** para hash de senhas
- **JWT** para tokens de autenticação

### Containerização
- **Docker** (sugestão para produção)
- Dockerfile para backend e frontend
- Docker Compose para orquestração dos serviços

### Inteligência Artificial
- Sistema de recomendação de filmes beseado em descrição (usando API do Gemini)

### Arquitetura da Aplicação
- **Monorepo** com separação clara entre backend (`/backend`) e frontend (`/kplus-web`)
- **REST API** para comunicação entre front e back
- **Middleware** para autenticação e autorização
- **Serviços** para lógica de negócio
- **Controllers** para rotas e integração com o banco
- **Public** para arquivos estáticos

---


