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
                 $http.get(myconf.url+'/ligas/'+liga)
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

app.factory('HistoricoService', function($http,myconf,$q){
    var items = [];

    return {
        getdata: function getdata(pullRefresh){
            var deferred = $q.defer();
            if(pullRefresh == false  && window.localStorage.getItem("prediccion") !== null  ) {
                console.log('de mememoria');
                items = JSON.parse(window.localStorage.getItem("prediccion"));
                deferred.resolve(items);
            }else{
                console.log('pulling');
                $http.get(myconf.url + '/prediccion/1').success(function(data) {
                    window.localStorage.setItem("prediccion", JSON.stringify(data));
                    items = data;
                    deferred.resolve(items);
                });
            }
            return deferred.promise;
        }
    }
});


app.factory('VipService', function($http,myconf,$q){
    var items = [];

    return {
        getdata: function getdata(pullRefresh){
            var deferred = $q.defer();
            if(pullRefresh == false  && window.localStorage.getItem("prediccionVIP") !== null  ) {
                console.log('de mememoria');
                items = JSON.parse(window.localStorage.getItem("prediccionVIP"));
                deferred.resolve(items);
            }else{
                console.log('pulling');
                $http.get(myconf.url+'/prediccionVip').success(function(data) {
                    window.localStorage.setItem("prediccionVIP", JSON.stringify(data));
                    items = data;
                    deferred.resolve(items);
                });
            }
            return deferred.promise;
        }
    }
});