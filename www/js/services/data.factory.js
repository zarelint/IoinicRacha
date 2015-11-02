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
    return match;
});

app.factory('LigaService', function($http, $log, $q) {
    var racha = {};

    return {
        getliga: function(liga) {
            var deferred = $q.defer();

            if (racha[liga] === undefined) {
                // $http.get('ligas.json')
                //$http.get('http://localhost:8080/ligas/'+liga)
                $http.get('http://nodejs-rachas.rhcloud.com/ligas/'+liga)
                    .success(function (data) {
                        racha[liga] = data;
                        racha[liga].calendarioFiltered =      angular.copy(racha[liga].calendario) ;
                        racha[liga].difGolFiltered =          angular.copy(racha[liga].difGol);
                        racha[liga].difPuntosFiltered =       angular.copy(racha[liga].difPuntos);
                        racha[liga].casaFiltered =            angular.copy(racha[liga].casa);
                        racha[liga].fueraFiltered =           angular.copy(racha[liga].fuera);
                        racha[liga].difPuntosCasaFiltered =   angular.copy(racha[liga].difPuntosCasa);
                        racha[liga].difPuntosFueraFiltered =  angular.copy(racha[liga].difPuntosFuera);

                        deferred.resolve(racha);
                    }).error(function (msg, code) {
                        deferred.reject(msg);
                        $log.error(msg, code);
                    });
            }else{
                deferred.resolve(racha);
            }
            return deferred.promise;
        }
    }
});

// carga las ligas segun se van consumiendo
/*
app.service('LigaService', function($http) {

    var racha = {};

    return {
        racha:racha,
        getligas: function() {
            return this.racha;
        },

        getliga: function(liga) {

            if (racha[liga] === undefined){
                $http.get('francia.json').
                    success(function(data) {
                        racha[liga] = data;
                        racha[liga].calendarioFiltered =      angular.copy(racha[liga].calendario) ;
                        racha[liga].difGolFiltered =          angular.copy(racha[liga].difGol);
                        racha[liga].difPuntosFiltered =       angular.copy(racha[liga].difPuntos);
                        racha[liga].casaFiltered =            angular.copy(racha[liga].casa);
                        racha[liga].fueraFiltered =           angular.copy(racha[liga].fuera);
                        racha[liga].difPuntosCasaFiltered =   angular.copy(racha[liga].difPuntosCasa);
                        racha[liga].difPuntosFueraFiltered =  angular.copy(racha[liga].difPuntosFuera);
                    });
            }

            return this.racha;
        }

    }
});
*/
