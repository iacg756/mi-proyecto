const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'productos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función auxiliar para leer los datos
function leerProductos() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Función auxiliar para guardar los datos
function guardarProductos(productos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(productos, null, 2));
}

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  const productos = leerProductos();
  res.json(productos);
});

// Registrar un nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio, cantidad } = req.body;

  if (!nombre || !precio || !cantidad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const productos = leerProductos();
  const nuevoProducto = {
    id: Date.now(),
    nombre,
    precio,
    cantidad
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);

  res.status(201).json(nuevoProducto);
});

// Eliminar un producto por id
app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let productos = leerProductos();

  productos = productos.filter(p => p.id !== id);
  guardarProductos(productos);

  res.json({ mensaje: 'Producto eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});