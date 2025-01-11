// Establece la conexión con el servidor a través de WebSocket
const socket = io();

// Elementos HTML donde se mostrará la lista de productos y formularios
const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

// Función para renderizar la lista de productos
socket.on('productList', (products) => {
  productList.innerHTML = ''; // Limpiar la lista antes de renderizarla nuevamente
  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - $${product.price}`;
    productList.appendChild(li); // Agregar cada producto a la lista en la vista
  });
});

// Agregar un nuevo producto
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  
  // Emitir el evento de agregar producto al servidor
  socket.emit('addProduct', { name, price });

  // Limpiar el formulario
  addProductForm.reset();
});

// Eliminar un producto
deleteProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('deleteProductName').value;

  // Emitir el evento de eliminar producto al servidor
  socket.emit('deleteProduct', name);

  // Limpiar el formulario
  deleteProductForm.reset();
});
