const http = require('node:http');
const { URL } = require('node:url');

const PORT = 3000;
const STATUS_VALIDOS = ['pendente', 'pronto', 'cancelado'];

let orders = [];
let nextId = 1; 

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req, callback) {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
  });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return callback(new Error('Corpo deve ser um objeto JSON'));
      }
      callback(null, parsed);
    } catch (err) {
      callback(new Error('JSON inválido'));
    }
  });
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean); 
  const method = req.method;

  if (parts[0] === 'orders') {
    const hasId = parts.length >= 2;
    const id = hasId ? Number(parts[1]) : null;
    const order = hasId ? orders.find((o) => o.id === id) : null;

    if (parts.length === 1 && method === 'GET') {
      const status = url.searchParams.get('status');
      const result = status ? orders.filter((o) => o.status === status) : orders;
      return sendJson(res, 200, result);
    }

    if (parts.length === 1 && method === 'POST') {
      return readBody(req, (err, body) => {
        if (err) return sendJson(res, 400, { error: err.message });
        if (!isNonEmptyString(body.client) || !isNonEmptyString(body.item)) {
          return sendJson(res, 400, { error: 'Campos "client" e "item" são obrigatórios' });
        }
        const novo = { id: nextId++, client: body.client, item: body.item, status: 'pendente' };
        orders.push(novo);
        sendJson(res, 201, novo);
      });
    }

    if (parts.length === 2 && method === 'GET') {
      if (!order) return sendJson(res, 404, { error: 'Pedido não encontrado' });
      return sendJson(res, 200, order);
    }

    if (parts.length === 2 && method === 'DELETE') {
      if (!order) return sendJson(res, 404, { error: 'Pedido não encontrado' });
      orders = orders.filter((o) => o.id !== id);
      res.writeHead(204); 
      return res.end();
    }

    if (parts.length === 3 && parts[2] === 'status' && method === 'PATCH') {
      return readBody(req, (err, body) => {
        if (err) return sendJson(res, 400, { error: err.message });
        if (!STATUS_VALIDOS.includes(body.status)) {
          return sendJson(res, 400, {
            error: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`,
          });
        }
        if (!order) return sendJson(res, 404, { error: 'Pedido não encontrado' });
        order.status = body.status;
        sendJson(res, 200, order);
      });
    }
  }

  sendJson(res, 404, { error: 'Rota não encontrada' });
});

server.listen(PORT, () => {
  console.log(`Dev Coffee API rodando na porta ${PORT}`);
});