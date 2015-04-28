'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: rachaCtrl
 * @description
 * # rachaCtrl
 * Controller of the iotutorialApp
 */
app.controller('aciertosCtrl', function (getResultados, $scope, getRacha, $ionicModal, $http,_) {
    //Tener un servidor propio permiter usar datos procesados y actualizados
    $http.get('http://nodejs-rachas.rhcloud.com/ResultadosPrimera').
        success(function(data) {
            // var prediccionJornada=   getRacha.GetPrediccion(data[0],data[1],5 );

            var resultados = data[0];
            var clasificacion = data[1];
            var resultbyCal = getRacha.getResultadosCalendario(resultados);

            var xx={};
            //crear array con el numero de jornadas jugafas
            for (var jor = 1; jor <= resultados[resultados.length-1][4]; jor++) {
                xx[jor]={};
            }
            for (var cal = 0; cal < resultados.length; cal++) {
                // for (var encuentros = 0; encuentros < encuentrostotales; encuentros++) {
                xx[resultados[cal][4]][resultados[cal][0]]=resultados[cal][2];
                xx[resultados[cal][4]][resultados[cal][2]]=resultados[cal][0];
            }


            //Funcion para ver los pronosticos acertados por jornadas
            // Comprobar % aciertos por Jornanada

            var aciertos=[], numPrediciones, numAciertos, prediccion, equipo;
            for (var jorEstimada = 6; jorEstimada < 33; jorEstimada++) {
                numPrediciones = 0;
                numAciertos = 0;

                prediccion = getRacha.GetPrediccion(resultados, clasificacion, jorEstimada);

                /*
                 // correcion de predicciones en base a confronactionm de rachas
                    if ( dejar predicciones coincidentes)
                    if (si hy contradicciomrd primar al que va por delante)
                    if (si hay contradries primar por promedio de goles)
                 */

                for (var ii = 0; ii < clasificacion.length; ii++) {
                    equipo = clasificacion[ii][1];

                    if (prediccion[equipo][0] !== 'x') {  // si hay una prediccion
                        numPrediciones++;
                        if (_.contains(prediccion[equipo], resultbyCal.calendario[equipo][jorEstimada])) {
                            numAciertos++;
                        }
                    }
                }
                aciertos[jorEstimada] = (numAciertos / numPrediciones) *  100;

            }

            console.log(JSON.stringify(aciertos));
        });





});
