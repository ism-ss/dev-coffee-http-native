curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"client":"Ana","item":"Latte"}'
curl http://localhost:3000/orders?status=pendente
curl -X PATCH http://localhost:3000/orders/1/status -H "Content-Type: application/json" -d '{"status":"pronto"}'
curl -X DELETE http://localhost:3000/orders/1