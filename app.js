const express = require('express');
const bodyParser = require('body-parser');
//const app = express();
const axios = require('axios');
//app.use(bodyParser.json());
const authService = require('./generarClave'); // Ajusta la ruta según la ubicación de tu archivo


// Llamada al endpoint '/generar-token' del servicio de autenticación
axios.post('http://localhost:3000/generar-token', {
  usuario: 'usuario',
  contraseña: 'contrasena',
})
  .then(response => {
    const { token, claveUnica } = response.data;
    // Guardar el token para usarlo en las solicitudes protegidas
    axios.defaults.headers.common['Authorization'] = token;
    console.log('Token:', token);
    console.log('Clave única:', claveUnica);

    axios.post('http://localhost:3000/calcular-prestamo', {
      idMaterial: '001',
      pesoGramos: 5,
  })
  
  .then(response => {
    const { montoPrestamo } = response.data;
    console.log('Monto del préstamo:', montoPrestamo);
  })

  .catch(error => {
    console.error('Error al llamar a la ruta protegida:', error.message);
  });
})

  .catch(error => {
    console.error('Error al llamar al endpoint:', error.message);
  });


