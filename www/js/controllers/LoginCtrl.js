'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: LoginCtrl
 * @description
 * # LoginController
 * Controller of the iotutorialApp
 */

app.controller('LoginCtrl', function( $http,$scope, $location, $ionicHistory,$window) {


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
    var google_callback='http://localhost:63342/IoinicRacha/www/callback.html';



    $scope.login = function() {
        window.localStorage.removeItem("token_rachas");
        window.location.href = encodeURI('https://accounts.google.com/o/oauth2/auth?client_id='
            + clientId + '&redirect_uri='+google_callback+'&scope='+google_scope+
            '&approval_prompt=auto&response_type=token&access_type=online');



    /*
        ref = window.open(
            'https://accounts.google.com/o/oauth2/auth?client_id='
            + clientId + '&redirect_uri='+google_callback+'&scope='+google_scope+
            '&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');

            ref.addEventListener('loadstart', function(event) {
            console.log(event.url);
            if((event.url).startsWith(google_callback)) {
                requestToken = (event.url).split("code=")[1];
                $http({method: 'post', url: 'https://accounts.google.com/o/oauth2/token',
                    data: 'client_id=' + clientId + '&client_secret=' +
                    clientSecret + '&redirect_uri='+google_callback+'&grant_type=authorization_code' + "&code=" + requestToken })
                    .success(function(data) {
                         accessToken = data.access_token;
                         $location.path("/tips");
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
         }

    */



    };


});
