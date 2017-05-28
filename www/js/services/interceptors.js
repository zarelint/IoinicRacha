'use strict';
app.factory('TokenInterceptor',
  function ($injector, $q,timeStorage,$log) {
    var hideLoadingModalIfNecessary = function() {
      var $http = $http || $injector.get('$http');
      if ($http.pendingRequests.length === 0) {
        $injector.get('$ionicLoading').hide();
      }
    };
    //$rootScope.$broadcast( 'loading:show' )
    return {
      request: function(config) {
        $injector.get('$ionicLoading').show();



        // Handle adding the id_token for prediccionVip api requests
        if (config.url.indexOf('prediccionVip') !== -1) {
          config.params = config.params || {};
          config.params.access_token = timeStorage.get('google_access_token');
        }
        return config;
      },
      requestError: function(rejection) {
        hideLoadingModalIfNecessary();
        return $q.reject(rejection);
      },
      response: function(response) {
        hideLoadingModalIfNecessary();
        return response;
      },
      responseError: function(rejection) {
        //SALVO EXPECECIONES LO CONVERTIMOS AL !! 401 esto hace cuando ve el token caducado vuele a pedir otro
        hideLoadingModalIfNecessary();
        $log.debug('interceptor.js:responseError' + JSON.stringify(rejection));

        if (rejection.config.url.indexOf('prediccion') != -1 &&  timeStorage.get('google_access_token') != false ){
          timeStorage.remove('google_access_token');//Toke esta revokado o caducado
        }
        // La respuesta de google es null y con este fix entra callbacksucess
        if ( rejection.config.url === "https://accounts.google.com/o/oauth2/revoke") {
          $log.debug('cambiamos response de url revoke');
          rejection.status = 200;
        }
        else if (rejection.status === 400  ) {
          $log.debug(' Las respuestsa 400 nos la tocamos');
        }else{// Esto trasforma los 500 ---> 401
          rejection.status = 401;
        }

        return $q.reject(rejection);
      }
    };
  }
);
