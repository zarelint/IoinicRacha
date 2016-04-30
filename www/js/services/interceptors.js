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
        hideLoadingModalIfNecessary();
        $log.debug('interceptor.js:responseError' + JSON.stringify(rejection));
        //"url":"https://accounts.google.com/o/oauth2/revoke"
        if (rejection.status === 400  ) { // jshint ignore:line
          //console.log('detected what appears to be an  auth error...'+rejection.data.error_description);

        }else{
          rejection.status = 401;
        }

        return $q.reject(rejection);
      }
    };
  }
);
