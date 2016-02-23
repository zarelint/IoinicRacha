
app.factory('AuthenticationFactory', function($window) {
    return {
        isLogged: false,
        check: function() {
            if ($window.sessionStorage.token && $window.sessionStorage.user) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }
    };

});

app.factory('UserAuthFactory', function($window, $location, $http) {
    return {
        login: function(username, password) {
            return $http.post('http://localhost:3000/login', {
                username: username,
                password: password
            });
        }
/*        ,logout: function() {
            if (AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.userRole;
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.userRole;
                $location.path("/login");
            }
        }*/
    }
});

app.factory('TokenInterceptor', function($q) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            //if ($window.sessionStorage.token) {
            if (accessToken) {
                //config.headers['X-Access-Token'] = $window.sessionStorage.token;
                //config.headers['X-Access-Token'] = accessToken;
                //$ curl -v -H "Authorization: Bearer 123456789" http://127.0.0.1:3000/
                config.headers['Authorization'] = 'Bearer'+' '+accessToken;
                // config.headers['X-Key'] = $window.sessionStorage.user;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },
        response: function(response) {
            return response || $q.when(response);
        }
    };
});


app.factory('AuthenticationService', function($rootScope, $http, authService) {
    var service = {


        login: function(user) {
            $http.post('https://login', { user: user }, { ignoreAuthModule: true })
                .success(function (data, status, headers, config) {
                    $http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1
                    // Store the token in SharedPreferences for Android, and Keychain for iOS
                    // localStorage is not very secure

                    // Need to inform the http-auth-interceptor that
                    // the user has logged in successfully.  To do this, we pass in a function that
                    // will configure the request headers with the authorization token so
                    // previously failed requests(aka with status == 401) will be resent with the
                    // authorization token placed in the header
                    authService.loginConfirmed(data, function(config) {  // Step 2 & 3
                        config.headers.Authorization = data.authorizationToken;
                        return config;
                    });
                })
                .error(function (data, status, headers, config) {
                    $rootScope.$broadcast('event:auth-login-failed', status);
                });
        },
        logout: function(user) {
            $http.post('https://logout', {}, { ignoreAuthModule: true })
                .finally(function(data) {
                    delete $http.defaults.headers.common.Authorization;
                    $rootScope.$broadcast('event:auth-logout-complete');
                });
        },
        loginCancelled: function() {
            authService.loginCancelled();
        }
    };
    return service;
})

