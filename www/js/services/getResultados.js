'use strict';

/**
 * @ngdoc service
 * @name iotutorialApp.getResultados
 * @description
 * # getResultados
 * Factory in the iotutorialApp.
 */
app
  .factory('getResultados', function ($http,$q,_) {
    var promise;
    var resultados = [];
    var clasificacion = [];
    window.j = $.noConflict();

   //$http.defaults.headers.common["X-Custom-Header"] = "Angular.js"

    var myService = {

      loadData: function () {
        if (!promise) { // impide que se llame dos veces
          //$http.get('resources/negozi.json' {header : {'Content-Type' : 'application/json; charset=UTF-8'}});
         //TODO implementar cache y guardar datos en FireBase
          var getCal = $http.get('http://www.marca.com/futbol/primera/calendario.html', { cache: true,crossDomain: true});
          var getCla = $http.get('clasificacion.html', { cache: true});
          promise = $q.all([getCal, getCla]);

          promise.then(function (data) {

            window.j(data[1].data).find('table#calsificacion_completa tbody tr').each(function () {
              var posicion = this.children[0].innerText;
              var equipo = this.children[1].innerText;
              clasificacion.push([posicion, equipo]);
            });

            var ultimaJornada = 1;
            //var numeroJornada = 1;


            /**
             * Este sistema para detectar la ultima jornada
             * dependen enteramente que en las joranada sin jugar lleven
             * asociado la clase 'proximaJornada'
             */
            window.j(data[0].data).find('div.jornadaCalendario.proximaJornada h2').each(function () {
              ultimaJornada =  this.innerText.substr(8)-1;
              return false;
            });

            window.j(data[0].data).find('div.jornadaCalendario').each(function () {
             var numeroJornada =  this.children[0].children[0].innerText.substr(8);
                if (numeroJornada <= ultimaJornada) {// solo leemos jornadas jugadas
                    window.j(this).find('a').each(function () {
                        var local = this.children[0].innerText;
                        var visitante = this.children[1].innerText;
                        var rVisitante, rLocal;

                        if (this.href === '') { // Partido anulado y pendiente de jugarse
                            rVisitante = 'x';
                            rLocal = 'x';
                        } else {
                            // numeroJornada = this.href.split('/')[8].split('_')[1];
                            var resultado = this.children[2].innerText;
                            rVisitante = resultado.split('-')[1]; //.replace(/Real/g, "");
                            rLocal = resultado.split('-')[0];
                        }
                        resultados.push([local, rLocal, visitante, rVisitante, numeroJornada]);

                    });
                }
            });
            // Le pego el cambiazo.
            angular.copy([resultados, clasificacion], data);
            return data;
          });
        }
        return promise;

      }
      };


    return myService;

  });
