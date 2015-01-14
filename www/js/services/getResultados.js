'use strict';

/**
 * @ngdoc service
 * @name iotutorialApp.getWebData
 * @description
 * # getWebData
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
          var getCal = $http.get('calendario.html', { cache: true});
          var getCla = $http.get('clasificacion.html', { cache: true});
          promise = $q.all([getCal, getCla]);

          promise.then(function (data) {

            window.j(data[1].data).find('table#calsificacion_completa tbody tr').each(function () {
              var posicion = this.children[0].innerText;
              var equipo = this.children[1].innerText;
              clasificacion.push([posicion, equipo]);
            });

            var ultimaJornada = 1;
            var numeroJornada = 1;
            var resultadosUltimaJornada = [];

            window.j(data[0].data).find('div.jornadaCalendario a').each(function () {
              if (this.href === '') {
                ultimaJornada = numeroJornada - 1;
                _.each(resultados, function (lista) {
                  if (lista[4] <= ultimaJornada) {
                    resultadosUltimaJornada.push(lista);
                  }
                });
                resultados = resultadosUltimaJornada;
                return false;
              } else {
                numeroJornada = this.href.split('/')[8].split('_')[1];
                var local = this.children[0].innerText;
                var visitante = this.children[1].innerText;
                var resultado = this.children[2].innerText;
                var rVisitante = resultado.split('-')[1]; //.replace(/Real/g, "");
                var rLocal = resultado.split('-')[0];
                resultados.push([local, rLocal, visitante, rVisitante, numeroJornada]);
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
