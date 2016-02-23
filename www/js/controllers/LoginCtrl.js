'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: LoginCtrl
 * @description
 * # LoginController
 * Controller of the iotutorialApp
 */


app.controller('LoginCtrl', function( $http,$scope, $interval, googleLogin,SocialAuth) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    var ref= null;

    /*
     - https://www.googleapis.com/auth/plus.me (Know who you are on Google) ( aplicaciones moviles google +)
     - https://www.googleapis.com/auth/userinfo.email (View your email address)
     - https://www.googleapis.com/auth/userinfo.profile (View basic information about your
     // con este scope los usuarios no necesitan tener perfil google plus
     //['https://www.googleapis.com/auth/userinfo.email']

     */
   // var google_scope='https://www.googleapis.com/auth/plus.profile.emails.read';
    var google_scope='https://www.googleapis.com/auth/userinfo.email';
    var google_callback='http://localhost:63342/IoinicRacha/www/';
    var silentLoginAttempt = function(){

        SocialAuth.isGooglePlusAvailable()
            .then(function(available){
                console.log("google plus availability is: " + available);
                if(!available){
                    $scope.showGoogleLogin = false;
                }
                else{
                    var promise = SocialAuth.googlePlusSilentLogin();

                    promise.success(function(msg){
                        console.log("silent login success");
                        $state.go('userInfo');
                    });

                    promise.error(function(err){
                        console.log("silent login failed: " + err);
                        $scope.showGoogleLogin = true;
                    });
                }
            });
    };
    $scope.google_data = {};
    $scope.login = function(){

        var promise = SocialAuth.googlePlusLogin();

        promise.success(function(msg){
            $state.go('userInfo');
        });
        promise.error(function(err){
            alert("Invalid login!! Error: " + err);
        });
    };

    $scope.login2 = function () {
        var promise = googleLogin.startLogin();
        promise.then(function (data) {
            $scope.google_data = data;
        }, function (data) {
            $scope.google_data = data;
        });
    };

    $scope.loginToInstagram = function() {


        var loginWindow = window.open(
            'https://accounts.google.com/o/oauth2/v2/auth?client_id='
            + clientId + '&redirect_uri='+google_callback+'&scope='+google_scope+
            '&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes');

        if (ionic.Platform.isWebView()) { // If running in a WebView (i.e. on a mobile device/simulator)
            loginWindow.addEventListener('loadstart', function(event) {
                if(  (event.url).startsWith(google_callback)   ) {
                    requestToken = (event.url).split("code=")[1];
                    $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                        .success(function(data) {
                            console.log(JSON.stringify(data));
                            accessToken = data.access_token;
                        })
                        .error(function(data, status) {
                            alert("ERROR: " + data);
                        });

                    loginWindow.close();
                    /*
                     if (self.isLoggedIn()) {
                     authService.loginConfirmed(null, configUpdater);
                     }*/
                }
            });

        } else {
            //he decido no seguir este camino porque la version web de google le mete mucha morralla a la app
            // if running on a desktop browser, use this hack
            console.log('InAppBrowser not present');
            var pollTimer = $interval(function () {
                try {
                    console.log("google window url " + loginWindow.document.URL);
                    if (loginWindow.document.URL.indexOf(google_callback) !== -1) {
                        console.log('redirect url found');
                        loginWindow.close();
                        $interval.cancel(pollTimer);
                        pollTimer = false;
                        var url = loginWindow.document.URL;
                        console.log(url);
                        url = url.substring(url.indexOf('?') + 1, url.length);
                        //ngroute add extra character #, (clean it)
                        var  access_code= url.replace('code=', '').replace('#','');


                        console.log(access_code);
                    }
                } catch (e) {
                }
            }, 100);
        }


/*            ref.addEventListener('loadstart', function(event) {
            console.log( 'd'+ (event.url));
            if((event.url).startsWith(google_callback)) {
                requestToken = (event.url).split("code=")[1];
                console.log('dentrorr');
                $http({method: 'post', url: 'https://accounts.google.com/o/oauth2/token',
                    data: 'client_id=' + clientId + '&client_secret=' +
                    clientSecret + '&redirect_uri='+google_callback+'&grant_type=authorization_code' + "&code=" + requestToken })
                    .success(function(data) {
                         accessToken = data.access_token;
                         $location.path("/historial");
                    })
                    .error(function(data, status) {
                        alert("ERROR: " + data);
                    });
                ref.close();
            }
             });

         if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
         };
         }*/





    };


});
