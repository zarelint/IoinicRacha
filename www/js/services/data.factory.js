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
    return match;
});




app.factory('LigaService', function($http, $log, $q) {
    var racha = {};

    return {
        getliga: function(liga) {
            var deferred = $q.defer();

            if (racha[liga] === undefined) {
                //  $http.get('ligas.json')
               $http.get('http://localhost:8080/ligas/'+liga)
                // $http.get('http://nodejs-rachas.rhcloud.com/ligas/'+liga)
                    .success(function (data) {
                        racha[liga] = data;
                        racha[liga].calendarioFiltered =      angular.copy(racha[liga].calendario) ;
                        racha[liga].difGolFiltered =          angular.copy(racha[liga].difGol);
                        racha[liga].difPuntosFiltered =       angular.copy(racha[liga].difPuntos);
                        racha[liga].casaFiltered =            angular.copy(racha[liga].casa);
                        racha[liga].fueraFiltered =           angular.copy(racha[liga].fuera);
                        racha[liga].difPuntosCasaFiltered =   angular.copy(racha[liga].difPuntosCasa);
                        racha[liga].difPuntosFueraFiltered =  angular.copy(racha[liga].difPuntosFuera);

                        racha[liga].listaEquipos = [];
                        for ( var equipo in data.clasificacion){
                            racha[liga].listaEquipos.push(equipo);
                        }

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

