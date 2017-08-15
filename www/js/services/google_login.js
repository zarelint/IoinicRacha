
app.factory('timeStorage', ['$localStorage','$log', function ($localStorage,$log) {
    var timeStorage = {};

    timeStorage.cleanUp = function () {
        var cur_time = new Date().getTime();
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf('_expire') === -1) {
                var new_key = key + "_expire";
                var value = localStorage.getItem(new_key);
                if (value && cur_time > value) {
                    $log.debug("Elimino key "+key+" "+new_key);
                    localStorage.removeItem(key);
                    localStorage.removeItem(new_key);
                }
            }
        }
    };
    timeStorage.remove = function (key) {
        this.cleanUp();
        var time_key = key + '_expire';
        $localStorage[key] = false;
        $localStorage[time_key] = false;
    };
    timeStorage.set = function (key, data, hours) {
        //this.cleanUp();
        $localStorage[key] = data;
        var time_key = key + '_expire';
        var time = new Date().getTime();
        time = time + (hours * 1 * 60 * 60 * 1000);
        $localStorage[time_key] = time;

    };
    timeStorage.get = function (key) {

        //this.cleanUp();
        var time_key = key + "_expire";
        //if (!$localStorage[time_key] || !$localStorage.refresh_token ) {
        if (!$localStorage[time_key]  ) {
            return false;
        }
        var expire = $localStorage[time_key] * 1;
        // Token caducado
        if (new Date().getTime() > expire) {
                //$localStorage[key] = null;
                //$localStorage[time_key] = null;
                return false;
        }
        return $localStorage[key];
    };


    return timeStorage;
}]);

app.factory('googleLogin', [
             '$http','$q', '$interval', '$log', 'timeStorage','$localStorage','authService','$ionicPopup','googlePlay','myconf','$timeout','$ionicLoading',
    function ($http, $q,      $interval, $log,   timeStorage,  $localStorage,  authService,$ionicPopup,   googlePlay,  myconf,$timeout,$ionicLoading) {
        // Initialize params
        var service = {};
        service.access_token = false;
        service.redirect_url = 'http://localhost:'+ myconf.chrome_port;
        service.client_id = '321359984550-m7cla0a172vi4t0ub7qg6qgfimg04pqp.apps.googleusercontent.com';
        service.secret = 'JysHsCm7a9O-luWR_aKUNExg';
        service.scopes = 'https://www.googleapis.com/auth/userinfo.email';
        // Fill config object
        var configUpdater = function(config) {
            config.params = config.params || {};
            config.params.access_token = timeStorage.get('google_access_token');
           // config.params.id_token = timeStorage.get('google_id_token');
            return config;
        };
        service.getAccessToken = function (def){
            //Primer acceso [ pantalla pedir permiso]
            var params = 'client_id=' + encodeURIComponent(service.client_id);
            params += '&redirect_uri=' + encodeURIComponent(service.redirect_url);
            params += '&response_type=code';
            params += '&access_type=offline';
            params += '&scope=' + encodeURIComponent(service.scopes);
            var authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + params;

            var win = window.open(authUrl, '_blank', 'location=no,toolbar=no,width=800, height=800');
            var context = this;

            if (ionic.Platform.isWebView()) {
                $log.debug('using in app browser');
                win.addEventListener('loadstart', function (data) {
                    $log.debug('load start');
                    if (data.url.indexOf(context.redirect_url) === 0) {
                        $log.debug('redirect url found ' + context.redirect_url);
                        $log.debug('window url found ' + data.url);
                        
                        win.close();
                        var url = data.url;
                        var access_code = context.gulp(url, 'code');
                        if (access_code) {
                            context.validateToken(access_code, def);
                        } else {
                            def.reject({error: 'Access Code Not Found'});
                        }
                    }

                });
            } else {
                $log.debug('InAppBrowser not found');
                var pollTimer = $interval(function () {
                    try {
                        $log.debug("google window url " + win.document.URL);
                        if (win.document.URL.indexOf(context.redirect_url) === 0) {
                            $log.debug('redirect url found');
                            win.close();
                            $interval.cancel(pollTimer);
                            pollTimer = false;
                            var url  = win.document.URL;
                            $log.debug('Final URL ' + url);
                           var access_code = context.gulp(url, 'code');
                            if (access_code) {
                                $log.debug('Access Code: ' + access_code);
                                context.validateToken(access_code, def);
                            } else {
                                def.reject({error: 'Access Code Not Found'});
                            }
                        }
                    } catch (e) {
                    }
                }, 100);
            }

        };
        // get code from url redirection
        service.gulp = function (url, name) {
            url = url.substring(url.indexOf('?') + 1, url.length);
            return url.replace('code=', '').replace('#','');
        };
        //Get new access_token  using a refresh_token ( no user ask)
        service.refresh_token = function (refresh_token, def) {
            $log.debug('refresh_token: ' + refresh_token);
            var http = $http({
                url: 'https://www.googleapis.com/oauth2/v4/token',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {
                    client_id: this.client_id,
                    client_secret: this.secret,
                    refresh_token:refresh_token,
                    grant_type: 'refresh_token'
                }
            });
            var context = this;
            /**
             * @param data                  response.
             * @param data.refresh_token    A token that may be used to obtain a new access token.
             * @param data.expires_in      The remaining lifetime of the access token.
             */
            http.then(function (data) {

               // $log.debug('google te da: ' + JSON.stringify(data));
                var access_token = data.data.access_token;
                var expires_in = data.data.expires_in;
                expires_in = expires_in * 1 / (60 * 60);
                timeStorage.set('google_access_token', access_token, expires_in);
                //  timeStorage.set('google_id_token', data.data.id_token, expires_in);
                // context.getUserInfo(access_token, def);

                if (access_token) {
                    $log.debug('Access Token :' + access_token);
                    authService.loginConfirmed(null, configUpdater); //copy token into headers
                    def.resolve(access_token);
                    //get Email:  context.getUserInfo(access_token, def);
                } else {
                    $log.debug( 'al coger token con token_refresh nos devuleve un toke vacio');
                    timeStorage.remove('google_access_token');
                    delete $localStorage.refresh_token;
                    def.reject({error: 'Access Token Not Found'});
                }

            }, function error(response) {
                $log.debug( '117: Fallo a coger token con token_refresh');
                timeStorage.remove('google_access_token');
                delete $localStorage.refresh_token;
                $log.debug(response);
            });




        };
        //get an access token and refresh_token from access_code
        service.validateToken = function (token, def) {
            $log.debug('validateToken: code: ' + token);
            var http = $http({
                url: 'https://www.googleapis.com/oauth2/v4/token',
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {
                    code: token,
                    client_id: this.client_id,
                    client_secret: this.secret,
                    redirect_uri: this.redirect_url,
                    grant_type: 'authorization_code'
                }
            });
            var context = this;
            /**
             * @param data                  response.
             * @param data.refresh_token    A token that may be used to obtain a new access token.
             * @param data.expires_in      The remaining lifetime of the access token.
             */
            http.then(function (data) {
                $log.debug('Google te da este refresh_token: ' + data.data.refresh_token);
  
                // set data
                var access_token = data.data.access_token;
                var expires_in = data.data.expires_in;
                expires_in = expires_in * 1 / (60 * 60);
                $localStorage.refresh_token = data.data.refresh_token;
                timeStorage.set('google_access_token', access_token, expires_in);

                // El problema de revocarlo aqui es que devuelve el token
                //if (!data.data.refresh_token ){
                //    service.revocar();
                //}
                
                if (access_token) {
                 
                    // En segundas Re-instalaciones es necesario
                    if (!$localStorage.refresh_token ){
                            def.resolve("revocado");
                            service.revocar();
                    }else{
                        authService.loginConfirmed(null, configUpdater); //copy token into headers
                        def.resolve(data.data.access_token);
                    }

                    // context.getUserInfo(access_token, def);
                } else {
                    def.reject({error: 'Access Token Not Found'});
                }
                

            });
        };

        service.revocar = function ( ) {

            // REVOCAR para recuperar forzar get refresh_token
            if ( !$localStorage['refresh_token'] && $localStorage['google_access_token']!== null  ) {
                $log.debug('llamada a revocar...');
                
                var http_revocar = $http({
                    url: myconf.url+'/revoke/'+$localStorage['google_access_token']
                });
                http_revocar.then(
                    function successCallback(data) {
                        // Por aqui no entra nunca por la respuesta es nula y no lo codifica como success
                        $log.debug('token revocado con exito' + data);
                        timeStorage.remove('google_access_token');
                        delete $localStorage.refresh_token;

                        $ionicLoading.show();
                        //Google tarda 8 segundos en revokar el token

                        $timeout( function(){
                              service.startLogin(false).then(function(greeting) {
                                  $log.debug('revocado successCallback' + greeting);
                                  if (greeting !== "revocado" ){
                                      $ionicLoading.hide();
                                      googlePlay.updateSubcription();
                                  }
                              }, function(reason) {
                                  $log.debug(reason);
                              });
                         }, 8000 );
                    
                    }, function errorCallback(response) {
                        $log.error('No podemos revocarlo porque el token a revokar estaba cadudado: ',  JSON.stringify(response));
                    }
                );
                
            }
        };

        service.getUserInfo = function (access_token, def) {
            var http = $http({
                url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                method: 'GET',
                params: {
                    access_token: access_token
                }
            });
            http.then(function (data) {
                $log.debug('service.getUserInfo '+JSON.stringify(data) );
                var user_data = data.data;
                var user = {
                    name: user_data.name,
                    gender: user_data.gender,
                    email: user_data.email,
                    google_id: user_data.sub,
                    picture: user_data.picture,
                    profile: user_data.profile
                };
                def.resolve(user);
            });
        };

        /**
         * @param {string} options.client_id    A token that may be used to obtain a new access token.
         * @param {string} options.redirect_uri      The remaining lifetime of the access token.
         * @param {string} options.scopes      The remaining lifetime of the access token.
         */
        service.authorize = function (options) {
            var def = $q.defer();
            var self = this;
            var access_token = timeStorage.get('google_access_token');
            $log.debug(JSON.stringify($localStorage));

            if (access_token) { // ya lo tenemos cacheado
                
                $log.debug('Direct Access Token :' + access_token);
                
                authService.loginConfirmed(null, configUpdater); //copy token into headers and retry request
                //service.getUserInfo(access_token, def);
                def.resolve(access_token);
                
            }else if( $localStorage.refresh_token !== undefined){ // get access_code  through refresh
                $log.debug("usando refresh token");
                service.refresh_token($localStorage.refresh_token, def);
            }else {// get new token via google plus


                //Pedir Token...
                if(typeof navigator.globalization !== "undefined") { //movil
                    var promise = service.googlePlusLogin();
                    promise.success(function (msg) {

                        $log.debug("Google plus plugin success: " + msg.serverAuthCode);
                        service.validateToken(msg.serverAuthCode, def);
                    });
                    promise.error(function (err) {
                        $log.debug("Google plus login failed: " + err);
                        service.getAccessToken(def);
                    });
                }else{
                    service.getAccessToken(def);
                }

            }
            return def.promise;
        };

        service.startLogin = function (compra) {
            var def = $q.defer();
            var promise = this.authorize({
                client_id: this.client_id,
                client_secret: this.secret,
                redirect_uri: this.redirect_url,
                scopes: this.scopes
            });
            promise.then(function (data) {

                def.resolve(data);
                if (compra){
                    googlePlay.subcribirse();
                }
 
            }, function (data) {
                $ionicPopup.alert({
                    title: 'Login went wrong',
                    template: 'Contact with support visualbetting@gmail.com'
                });
                $log.error("ERROR-GoogleLogin: "+data);
                def.reject(data.error);
            });
            return def.promise;
        };

        service.logout = function() {
            var promise = ionic.Platform.isWebView() ? $http.post(LOGOUT_URL) : $http.jsonp(LOGOUT_URL);
            promise.error(function (data, status) {
                    // expect to get a 404 error on the desktop browser due to the nature of the response from Instagram
                    // The Instagram API doesn't officially have a logout function
                    $log.debug('logout returned status:' + status);
                })
                .finally(function() {
                    delete $localStorage.accessToken;
                    $rootScope.$broadcast('event:auth-logoutComplete');
                });
            return promise;
        };

        service.isLoggedIn = function() {
            return !!timeStorage.get('google_access_token');
        };

        /**
         * @brief Static method that attempts to log-in using Google+ auth API.
         * This method returns a promise with success/error callbacks.
         *
         * @returns obj The success callback gets a JSON object with the following contents g.e.
         *  obj.email        // 'eddyverbruggen@gmail.com'
         *  obj.userId       // user id
         *  obj.displayName  // 'Eddy Verbruggen'
         *  obj.gender       // 'male' (other options are 'female' and 'unknown'
         *  obj.imageUrl     // 'http://link-to-my-profilepic.google.com'
         *  obj.givenName    // 'Eddy'
         *  obj.middleName   // null (or undefined, depending on the platform)
         *  obj.familyName   // 'Verbruggen'
         *  obj.birthday     // '1977-04-22'
         *  obj.ageRangeMin  // 21 (or null or undefined or a different number)
         *  obj.ageRangeMax  // null (or undefined or a number)
         *  obj.idToken
         *  obj.oauthToken
         */
        service.googlePlusLogin = function() {
            var deferred = $q.defer();
            window.plugins.googleplus.login(
                {
                    'offline': true//,
                    //'iOSApiKey': 'my_iOS_API_KEY_if_I_have_one',//,//,
                    //'scope' : 'https://www.googleapis.com/auth/userinfo.email',
                    , 'webClientId': service.client_id
                },
                function (obj) {
                    //$log.debug('Respuesta google plus: ' +JSON.stringify(obj));
                    deferred.resolve(obj);
                },
                function (err) {
                    $log.debug('codigo error plugin google plus: ' +JSON.stringify(err));
                    deferred.reject(err);
                }
            );
            //}

            //get the promise object
            var promise = deferred.promise;

            //add success callback to the promise, and associate it with the RESOLVE call
            promise.success = function(fn) {
                return promise.then(function(response) {
                    fn(response);
                })
            };

            //add error callback to the promise, and associate it with the REJECT call
            promise.error = function(fn) {
                return promise.then(null, function(response) {
                    fn(response);
                })
            };

            //return the promise object
            return promise;
        };

        return service;
    }
]);