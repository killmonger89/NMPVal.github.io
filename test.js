const { expect } = require('chai');
const axios = require('axios');
const { authService } = require('./generarClave');

describe('Pruebas para authService', function () {
  // Antes de todas las pruebas, inicia el servidor
  before(function (done) {
    this.server = authService.listen(() => {
      console.log('Servidor de prueba iniciado en un puerto aleatorio');
      done();
    });
  });

  // Después de todas las pruebas, cierra el servidor
  after(function () {
    this.server.close(() => {
      console.log('Servidor de prueba cerrado');
    });
  });

  it('Debería generar un token y clave única', function () {
    return axios.post('http://localhost:3000/generar-token', {
      usuario: 'usuario',
      contraseña: 'contrasena',
    })
      .then(response => {
        const { data } = response;
        expect(data).to.have.property('token');
        expect(data).to.have.property('claveUnica');
      });
  });

  it('Debería calcular un préstamo protegido', function () {
    // Aquí puedes realizar la llamada para generar un token y luego usarlo para la llamada protegida
    return axios.post('http://localhost:3000/generar-token', {
      usuario: 'usuario',
      contraseña: 'contrasena',
    })
      .then(response => {
        const { token } = response.data;
        axios.defaults.headers.common['Authorization'] = token;

        return axios.post('http://localhost:3000/calcular-prestamo', {
          idMaterial: '001',
          pesoGramos: 5,
        });
      })
      .then(response => {
        const { data } = response;
        expect(data).to.have.property('montoPrestamo');
      });
  });
});
