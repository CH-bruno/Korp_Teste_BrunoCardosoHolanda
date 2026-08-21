# Korp_Teste_BrunoCardosoHolanda

Teste prático para vaga — Sistema de emissão de notas fiscais, com arquitetura de microsserviços, tratamento de falhas entre serviços e persistência real em banco de dados.

## Visão geral

Aplicação Angular para emissão de notas fiscais, com dois microsserviços em ASP.NET Core:

- **Estoque Service** — controle de produtos e saldos;
- **Faturamento Service** — gestão de notas fiscais, orquestrando a baixa de estoque via chamada HTTP ao Estoque Service.

Cada serviço possui seu próprio banco de dados (`EstoqueDb` e `FaturamentoDb`) no SQL Server.

## Stack utilizada

| Camada | Tecnologias |
|---|---|
| Frontend | Angular, Angular Material, RxJS, Reactive Forms |
| Backend | C# / ASP.NET Core Web API, Entity Framework Core, Polly |
| Banco de dados | SQL Server (Express) |

## Estrutura do repositório

```
Korp_Teste_BrunoCardosoHolanda/
├── backend/
│   ├── EstoqueService/
│   ├── FaturamentoService/
│   └── Korp_Teste_BrunoHolanda.slnx
├── frontend/
│   └── korp-notas/
├── Documentacao_tecnica_korp.pdf
└── README.md
```

## Pré-requisitos

- [.NET SDK](https://dotnet.microsoft.com/download) (versão 10)
- [Node.js](https://nodejs.org/) + npm
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
- [SQL Server Express](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) (instância local, ex: `localhost\SQLEXPRESS`, autenticação do Windows)

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/CH-bruno/Korp_Teste_BrunoCardosoHolanda.git
cd Korp_Teste_BrunoCardosoHolanda
```

### 2. Configurar as connection strings

Confirme (ou ajuste) a connection string em cada `appsettings.json`:

**`backend/EstoqueService/appsettings.json`**
```json
"ConnectionStrings": {
  "EstoqueDb": "Server=localhost\\SQLEXPRESS;Database=EstoqueDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

**`backend/FaturamentoService/appsettings.json`**
```json
"ConnectionStrings": {
  "FaturamentoDb": "Server=localhost\\SQLEXPRESS;Database=FaturamentoDb;Trusted_Connection=True;TrustServerCertificate=True"
},
"EstoqueServiceUrl": "http://localhost:5007/"
```

### 3. Subir o Estoque Service

```bash
cd backend/EstoqueService
dotnet restore
dotnet ef database update
dotnet run
```

Serviço disponível em `http://localhost:5007` (Swagger em `http://localhost:5007/swagger`).

### 4. Subir o Faturamento Service

Em outro terminal:

```bash
cd backend/FaturamentoService
dotnet restore
dotnet ef database update
dotnet run
```

Serviço disponível em `http://localhost:5230` (Swagger em `http://localhost:5230/swagger`).

### 5. Subir o Frontend Angular

Em outro terminal:

```bash
cd frontend/korp-notas
npm install
ng serve
```

Aplicação disponível em `http://localhost:4200`.

> **Importante:** os três processos (Estoque, Faturamento e Angular) precisam estar rodando simultaneamente para a aplicação funcionar por completo.

## Funcionalidades

- CRUD completo de produtos (código, descrição, saldo);
- Criação de notas fiscais com múltiplos itens e numeração sequencial automática;
- Impressão de nota fiscal, com baixa de estoque orquestrada entre os dois microsserviços;
- Bloqueio de reimpressão de notas já fechadas;
- Cenário de falha entre microsserviços, com retry automático (Polly) e feedback claro ao usuário, mantendo a nota em aberto para nova tentativa;
- Controle de concorrência otimista no saldo de produtos, validado com o cenário de duas notas disputando a última unidade em estoque.

## Requisitos do desafio

| Requisito | Status |
|---|---|
| Arquitetura de microsserviços (Estoque + Faturamento) | ✅ |
| Tratamento de falhas com recuperação e feedback | ✅ |
| Persistência real em banco de dados | ✅ |
| *(Opcional)* Tratamento de concorrência | ✅ |


O detalhamento técnico completo (ciclos de vida do Angular, uso de RxJS, bibliotecas, LINQ, tratamento de erros, etc.) está em [`Documentacao_tecnica_korp.pdf`](./Documentacao_tecnica_korp.pdf).

## Autor

Bruno Cardoso Holanda
