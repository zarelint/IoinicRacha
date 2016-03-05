'use strict';

/**
 * @ngdoc function
 * @name iotutorialApp.controller: LoginCtrl
 * @description
 * # LoginController
 * Controller of the iotutorialApp
 */


app.controller('LoginCtrl', function( $ionicPlatform,$http,$scope,$state, $interval, googleLogin,SocialAuth) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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
                        $state.go('tabs.historial');
                    });

                    promise.error(function(err){
                        console.log("silent login failed: " + err);
                        $scope.showGoogleLogin = true;
                    });
                }
            });
    };

    var initView = function(){

        $scope.showGoogleLogin = false;

        $ionicPlatform.ready(function(){
            if(SocialAuth.getAuthUser() == null){
                silentLoginAttempt();
            }
            else{
                $state.go('tabs.historial');
            }
        })

    };


    $scope.$on('$ionicView.beforeEnter', function(){
        initView();
    });


    $scope.login = function(){

        var promise = SocialAuth.googlePlusLogin();

        promise.success(function(msg){
            $state.go('tabs.historial');
        });
        promise.error(function(err){
            alert("Invalid login!! Error: " + err);
        });
    }



});
