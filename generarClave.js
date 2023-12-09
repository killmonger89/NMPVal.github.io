// funciones.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const authService = express();
authService.use(bodyParser.json());

const preciosPorMaterial = {
  '001': 1500.00,
  '002': 1000.00,
  '003': 800.00,
  '004': 500.00,
  '005': 300.00,
  '006': 200.00,
  '007': 100.00,
};

// Secret key para firmar y verificar tokens (deberías guardar esto de manera segura)
const secretKey = 'NACIONALMDP';

// Función para generar una clave única usando SHA-256
const generarClaveSHA256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};



authService.post('/generar-token', (req, res) => {
  const { usuario, contraseña } = req.body;

  // Verificar credenciales (esto debería ser más seguro en un entorno de producción)
  if (usuario === 'usuario' && contraseña === 'contrasena') {
    // Generar un token con información del usuario
    const token = jwt.sign({ usuario }, secretKey, { expiresIn: '1h' });
    // Generar una clave única para este usuario usando SHA-256
    const claveUnica = generarClaveSHA256(usuario);

    res.json({ token, claveUnica });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// Middleware para verificar el token en las peticiones
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Falta el token.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = decoded.usuario; // Puedes almacenar información del usuario en req para usarla posteriormente
    next();
  });
};

// Ruta protegida con el middleware de autenticación
authService.post('/calcular-prestamo', verificarToken, (req, res) => {
  try {
    const { idMaterial, pesoGramos } = req.body;

    if (!(idMaterial in preciosPorMaterial)) {
      return res.status(400).json({ error: 'Material no válido' });
    }

    const precioGramo = preciosPorMaterial[idMaterial];
    const montoPrestamo = (pesoGramos * precioGramo) * 0.8;

    res.json({ montoPrestamo });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
});

const PORT = process.env.PORT || 3000;

const server = authService.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Configurando un temporizador para cerrar el servidor después de 10 minutos (ajusta según tus necesidades)
const tiempoDeEjecucionEnMilisegundos = 3 * 60 * 1000; // 5 minutos
setTimeout(() => {
  server.close(() => {
    console.log('Servidor cerrado después del tiempo de ejecución especificado.');
  });
}, tiempoDeEjecucionEnMilisegundos);



module.exports = {authService};
