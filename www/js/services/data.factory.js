app.factory('dataFactory', function($http) {
    /** https://docs.angularjs.org/guide/providers **/
    var urlBase = 'http://localhost:8080/api/v1/products';
    var _prodFactory = {};
    _prodFactory.getProducts = function() {
        return $http.get(urlBase);
    };
    return _prodFactory;
});

/**
 * Paratido a analizar
 */
app.factory('detailMatch', function() {
    var match  = {};
    match.equipo1 = '';
    match.equipo2 = '';
    match.liga = '';
    match.jornada = '';
    match.algodesc = '';
    match.from = '';
    return match;
});




app.factory('LigaService', function(myconf,$http, $log, $q) {
    var racha = {};

    return {
        getliga: function(liga) {
            var deferred = $q.defer();

            if (racha[liga] === undefined) {
                //  $http.get('ligas.json')
                //  $http.get('http://localhost:8080/ligas/'+liga)
              //  $http.get(myconf.url + 'ligas/'+ liga)  http://localhost:8080/ligas/italia2
                  $http.get('https://nodejs-rachas.rhcloud.com/ligas/'+liga)
                // $http.get('http://localhost:8080/ligas/'+liga)
                    .success(function (data) {
                        racha[liga] = data;

                        racha[liga].calendarioFiltered =      angular.copy(racha[liga].calendario) ;
                        racha[liga].casaFiltered =            angular.copy(racha[liga].casa);
                        racha[liga].fueraFiltered =           angular.copy(racha[liga].fuera);

                        racha[liga].difPuntosFiltered =       angular.copy(racha[liga].difPuntos);
                        racha[liga].difPuntosCasaFiltered =   angular.copy(racha[liga].difPuntosCasa);
                        racha[liga].difPuntosFueraFiltered =  angular.copy(racha[liga].difPuntosFuera);

                        racha[liga].golCasaRateFiltered =   angular.copy(racha[liga].golCasaRate);
                        racha[liga].golFueraRateFiltered =  angular.copy(racha[liga].golFueraRate);
                        racha[liga].golRateFiltered =       angular.copy(racha[liga].golRate);


                        deferred.resolve(racha);
                    }).error(function (msg, code) {
                        deferred.reject(msg);
                        $log.error(msg, code);
                    });
            }else{
                deferred.resolve(racha);
            }
            return deferred.promise;
        },
        getAlgo: function getDescAlgo(myParam) {
            var rangoJornadas =myParam[1][Object.keys(myParam[1])[0]].rangoJornadas;
            if (Object.keys(myParam[1]==='casaIgualdad') && rangoJornadas=== undefined){
                rangoJornadas= 'Todos los'
            }
            var tipo='';
            if (Object.keys(myParam[1])[0] === 'casaIgualdad'){
                tipo ='Casa/Fuera'
            }
            return rangoJornadas + ' partidos ' + tipo;
        }
    }
});

