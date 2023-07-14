# Portal de solicitação de crédito

## Requisitos para iniciar o projeto

Para desenvolvimento, você precisará do [Node](http://nodejs.org/) instalado em seu ambiente.

` node --version  v14.18.1`
` npm --version   6.14.15`

## Instalação de dependências

` npm install`

## Projeto

### Iniciar aplicação

`npm start`

### Gerar aplicação

`npm run build`

Consulte a seção sobre [implantação](https://facebook.github.io/create-react-app/docs/deployment) para obter mais informações.

## Estrutura do projeto

```
├── src
│ 	├── assets:
│	  │    ├── images: Imagens da aplicação.
│	  ├── components: Componentes reutilizáveis.
│ 	├── contexts: Estado global do usuário na aplicação.
│	  ├── enum: Conversão de dados.
│ 	├── helper:
│   │     └── ProtectedRoute.tsx: Proteção das rotas.
│	  ├── hooks
│ 	├── layout
│	  ├── pages: Páginas do sistema.
│ 	├── services
│	  ├── utils: Funções de formatação.
│   ├── App.tsx: Criação das rotas e permissões de rotas.
└── README.md
```

## Linguagens e ferramentas

### JavaScript

- [React](https://react.dev/) para criação das interfaces.
- [Typescript](https://www.typescriptlang.org/) para tipagem do sistema.

### CSS

- [Styled components](https://styled-components.com/) para estilização e diagramação.

### UI

- [Ant design](https://ant.design/docs/react/introduce) conjunto de componentes com Design system.
