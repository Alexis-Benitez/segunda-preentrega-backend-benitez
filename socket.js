const socket = io();

// Elementos HTML
const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const cartList = document.getElementById('cartList');
let cart = [];

// Función para renderizar la lista de productos
function renderProductList(products) {
  productList.innerHTML = ''; // Limpiar lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price} <button onclick="addToCart('${product.name}')">Agregar al carrito</button>`;
    productList.appendChild(li);
  });
}

// Agregar producto al carrito
function addToCart(productName) {
  const product = products.find(p => p.name === productName);
  if (product) {
    cart.push(product);
    renderCart();
  }
}

// Renderizar el carrito
function renderCart() {
  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
  });
}

// Función de búsqueda
function searchProduct() {
  const query = document.getElementById('searchProduct').value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  renderProductList(filteredProducts);
}

// Agregar un nuevo producto
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;

  socket.emit('addProduct', { name, price });
  addProductForm.reset();
});

// Eliminar un producto
deleteProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('deleteProductName').value;
  socket.emit('deleteProduct', name);
  deleteProductForm.reset();
});

// Recibir lista de productos del servidor
socket.on('productList', (productsFromServer) => {
  products = productsFromServer;
  renderProductList(products);
});
