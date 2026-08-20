# Korp Teste - Project Initialization Guide

## Project Overview
This is a fiscal note emission system (Sistema de emissão de notas fiscais) with:
- **Backend**: Two .NET 10.0 microservices
  - EstoqueService (Inventory Service)
  - FaturamentoService (Billing Service)
- **Frontend**: Angular 22.1.0 with Material Design and SSR

## Prerequisites
- **Node.js**: v20+ (for npm@11.17.0)
- **.NET SDK**: 10.0+
- **SQL Server**: Local or remote instance

## Backend Setup

### 1. Restore NuGet Packages
```bash
# From the solution root or each service directory
dotnet restore
```

### 2. Database Configuration
Configure the connection string in `appsettings.json` for each service:
- `backend/EstoqueService/appsettings.json`
- `backend/FaturamentoService/appsettings.json`

Example:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=KorpDB;Trusted_Connection=true;"
  }
}
```

### 3. Run Migrations (if applicable)
```bash
cd backend/EstoqueService
dotnet ef database update

cd ../FaturamentoService
dotnet ef database update
```

### 4. Build Backend Services
```bash
dotnet build
```

### 5. Run Backend Services
```bash
# Terminal 1 - EstoqueService
cd backend/EstoqueService
dotnet run

# Terminal 2 - FaturamentoService
cd backend/FaturamentoService
dotnet run
```

Services will be available at:
- EstoqueService: `https://localhost:5001`
- FaturamentoService: `https://localhost:5002`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend/korp-notas
npm install
```

### 2. Development Server
```bash
npm start
```

Application will be available at `http://localhost:4200`

### 3. Build for Production
```bash
npm run build
```

### 4. Run with SSR
```bash
npm run serve:ssr:korp-notas
```

## Project Structure
```
Korp_Teste_BrunoHolanda/
├── backend/
│   ├── EstoqueService/      (Inventory microservice)
│   └── FaturamentoService/  (Billing microservice)
├── frontend/
│   └── korp-notas/          (Angular application)
└── README.md
```

## Key Technologies
- **Backend**: ASP.NET Core 10.0, Entity Framework Core 10.0, OpenAPI/Swagger
- **Frontend**: Angular 22.1, Angular Material, Angular Universal (SSR)
- **Database**: SQL Server
- **Resilience**: Polly (FaturamentoService)

## Testing APIs
- EstoqueService OpenAPI: `https://localhost:5001/openapi/v1.json`
- FaturamentoService OpenAPI: `https://localhost:5002/openapi/v1.json`

Both services expose OpenAPI documentation and interactive UI in development mode.

## Next Steps
1. Configure database connection strings
2. Restore backend dependencies
3. Create and run database migrations
4. Start backend services
5. Install frontend dependencies
6. Start frontend development server
