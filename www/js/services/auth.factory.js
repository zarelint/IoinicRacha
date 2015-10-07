
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

app.factory('TokenInterceptor', function($q, $window) {
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