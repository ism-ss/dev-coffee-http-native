# Dev Coffee API

API REST em memória para fila de pedidos da cafeteria Dev Coffee,
feita com o módulo nativo `node:http` (sem dependências externas).

**Autor:** Ismael [sobrenome]

## Como executar
Requisitos: Node.js 18+
    npm start
Servidor em http://localhost:3000

## Endpoints e exemplos

### Listar pedidos
curl http://localhost:3000/orders

### Filtrar por status
curl "http://localhost:3000/orders?status=pendente"

### Buscar por ID
curl http://localhost:3000/orders/1

### Criar pedido
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"client":"Ana","item":"Latte"}'

### Atualizar status
curl -X PATCH http://localhost:3000/orders/1/status -H "Content-Type: application/json" -d '{"status":"pronto"}'

### Remover pedido
curl -X DELETE http://localhost:3000/orders/1

### Rota inexistente (404)
curl http://localhost:3000/qualquer-coisa
