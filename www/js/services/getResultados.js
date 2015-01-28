'use strict';

/**
 * @ngdoc service
 * @name iotutorialApp.getResultados
 * @description
 * # getResultados
 * Factory in the iotutorialApp.
 */
app
    .factory('getResultados', function ($http, $q) {
        var promise;
        var resultados = [];
        var clasificacion = [];
        window.j = $.noConflict();

        var myService = {

            loadData: function () {

                if (!promise) { // impide que se llame dos veces

                   //window.j.ajaxSetup({ scriptCharset: 'ISO-8859-15', contentType: 'application/json; charset=ISO-8859-15'});
                   // var promise2 = window.j.getJSON('http://whateverorigin.org/get?url=' +
                   // encodeURIComponent('http://www.marca.com/futbol/primera/calendario.html') + '&callback=?');
                    //TODO whateverorigin devuelve caracteres extraños
                    //var getCal = $http.jsonp('http://whateverorigin.org/get?' +
                    //'url=http://www.marca.com/futbol/primera/calendario.html&callback=JSON_CALLBACK',
                    //    { headers : {'Content-Type': 'application/json; charset=utf-8', scriptCharset: 'utf-8'} }
                    //);
                    var getCal = $http.get('http://www.marca.com/futbol/primera/calendario.html');
                    var getCla = $http.get('clasificacion.html', {cache: true});
                    promise = $q.all([getCal, getCla]);


                    promise.then(function (data) {

                        window.j(data[1].data).find('table#calsificacion_completa tbody tr').each(function () {
                            var posicion = this.children[0].innerText;
                            var equipo = this.children[1].innerText.replace('.', '');
                            clasificacion.push([posicion, equipo]);
                        });

                        var ultimaJornada = 1;



                        /**
                         * Este sistema para detectar la ultima jornada
                         * dependen enteramente que en las joranada sin jugar lleven
                         * asociado la clase 'proximaJornada'
                         */
                        window.j(data[0].data).find('div.jornadaCalendario.proximaJornada h2').each(function () {
                            ultimaJornada = this.innerText.substr(8) - 1;
                            return false;
                        });

                        window.j(data[0].data).find('div.jornadaCalendario').each(function () {
                            var numeroJornada = this.children[0].children[0].innerText.substr(8);
                            if (numeroJornada <= ultimaJornada) {// solo leemos jornadas jugadas
                                window.j(this).find('a').each(function () {
                                    var local = this.children[0].innerText.replace('.', '');
                                    var visitante = this.children[1].innerText.replace('.', '');
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
