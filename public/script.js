const form = document.getElementById('formProducto');
const cuerpoTabla = document.getElementById('cuerpoTabla');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);

async function cargarProductos() {
  const res = await fetch('/api/productos');
  const productos = await res.json();

  cuerpoTabla.innerHTML = '';

  productos.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${producto.precio}</td>
      <td>${producto.cantidad}</td>
      <td><button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const cantidad = document.getElementById('cantidad').value;

  await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, precio, cantidad })
  });

  form.reset();
  cargarProductos();
});

async function eliminarProducto(id) {
  await fetch(`/api/productos/${id}`, { method: 'DELETE' });
  cargarProductos();
}