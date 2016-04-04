
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




app.factory('LigaService', function(myconf,$http, $log, $q ) {

    var racha = {};
    var items = [];

    return {
        clearAll: function(){
           // window.localStorage.clear();
            for ( var cache in window.localStorage){
                if ( cache.indexOf('ngStorage') === -1){
                    window.localStorage.removeItem(cache);
                }
            }
        },
        getliga: function(liga) {
            var deferred = $q.defer();

            //Si no esta guardado haz llamada
            if (racha[liga] === undefined && window.localStorage.getItem(liga) == null ) {
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

                       window.localStorage.setItem(liga, JSON.stringify(racha[liga]));

                        // $localStorage[liga]= JSON.stringify(racha);


                        deferred.resolve(racha);
                    }).error(function (msg, code) {
                    deferred.reject(msg);
                    $log.error(msg, code);
                });
            }else{
                if (window.localStorage.getItem(liga) !== null){
                    racha[liga] = JSON.parse(window.localStorage.getItem(liga));
                }
                deferred.resolve(racha);
            }
            return deferred.promise;


        },
        getAlgo: function getDescAlgo(myParam) {
            var rangoJornadas =myParam[1][Object.keys(myParam[1])[0]].rangoJornadas;

            if (rangoJornadas=== undefined){
                var rangoJornadas = '';
            }

            var tipo='';
            if (Object.keys(myParam[1])[0] === 'casaIgualdad'+rangoJornadas){
                tipo ='Casa/Fuera '
            }
            if (Object.keys(myParam[1])[0] === 'casafull'+rangoJornadas){
                tipo ='Todos los partidos '
            }
            if (Object.keys(myParam[1])[0] === 'casa'+rangoJornadas){
                tipo ='Casa/Fuera '
            }
            return tipo +rangoJornadas;
        },
        getListaLigas: function getListaLigas(pullRefresh){
                    var deferred = $q.defer();
                    if(pullRefresh == false  && window.localStorage.getItem("listaligas") !== null  ) {
                        items = JSON.parse(window.localStorage.getItem("listaligas"));
                        deferred.resolve(items);
                    }else{
                        $http.get(myconf.url + '/listaligas').success(function(data) {
                           // data.splice(0, 0, "All");
                            window.localStorage.setItem("listaligas", JSON.stringify(data));
                            items = data;
                            deferred.resolve(items);
                        });
                    }
                    return deferred.promise;

        }
    }

});

app.factory('HistoricoService', function($http,myconf,$q){
    var items = [];

    return {
        getdata: function getdata(pullRefresh){
            var deferred = $q.defer();
            if(pullRefresh == false  && window.localStorage.getItem("prediccion") !== null  ) {
                items = JSON.parse(window.localStorage.getItem("prediccion"));
                deferred.resolve(items);
            }else{
                //console.log('pulling');
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

                items = JSON.parse(window.localStorage.getItem("prediccionVIP"));
                deferred.resolve(items);
            }else{ //pull
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

