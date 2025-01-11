const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Lista de productos (se puede actualizar en tiempo real)
let products = [];

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main'  // Configura 'main.handlebars' como layout por defecto
}));
app.set('view engine', 'handlebars');
app.set('views', './views'); // Ruta para las vistas

// Middleware
app.use(express.static('.')); // Sirve archivos estáticos desde la raíz
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.render('index', { products });
});

// Ruta para la página de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// WebSocket para gestionar la lista de productos en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Enviar la lista de productos cuando el cliente se conecta
  socket.emit('productList', products);

  // Evento para agregar un nuevo producto
  socket.on('addProduct', (product) => {
    products.push(product);
    io.emit('productList', products); // Actualizar la lista de productos en todos los clientes
  });

  // Evento para eliminar un producto
  socket.on('deleteProduct', (productName) => {
    products = products.filter(p => p.name !== productName);
    io.emit('productList', products); // Actualizar la lista de productos en todos los clientes
  });
});

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
