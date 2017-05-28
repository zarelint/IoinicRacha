app.controller('AppCtrl', function(
    $rootScope,
    $scope,
    $ionicModal,
    googleLogin,
    authService,
    timeStorage,
    $translate,
    $ionicLoading,
    $http,
    $ionicPopup,$log,$localStorage,$ionicHistory,$state
    ) {

/*    $scope.$on("$ionicView.loaded", function(    ){
        HeyzapAds.BannerAd.show(HeyzapAds.BannerAd.POSITION_BOTTOM)
    });*/


    $ionicModal.fromTemplateUrl('templates/detail/info.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $log.debug('Crear dialogo modal help solo una vez...');
        $rootScope.infoDialog = modal;
    });
    $rootScope.openModal = function() {
        $rootScope.infoDialog.show();
    };
    $rootScope.closeModal = function() {
        $rootScope.infoDialog.hide();
    };


    //Rate dialog
    $scope.rateDialog = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('Apoyanos'),
            template: $translate.instant('Apoyanos-2')
        });
        confirmPopup.then(function(res) {
            if(res) {
                window.open(social_config.url, '_system')
            }
        });
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });



    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        authService.loginCancelled();
        $scope.loginModal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.loginModal.remove();
    });



    // Open the login modal
    $scope.login = function() {
        $scope.loginModal.show();
    };


    // Perform the OAuth login to GmailService
    $scope.loginToGoogle = function() {
        $scope.loginModal.hide();
        googleLogin.startLogin();

    };

    // Handle the login required event raised by the authService
    $scope.$on('event:auth-loginRequired', function() {
        $log.debug('AppCtrl: handling event:auth-loginRequired  ...');
        if ( !$localStorage['refresh_token'] ){
            alert('event:auth-loginRequired');
            $scope.loginModal.show();
        }else{
            alert('event:auth-loginRequired');
           googleLogin.startLogin(false);
        }
    });
    // Handle the login confirmed event raised by the authService
    $scope.$on('event:auth-caducada', function() {
        $log.debug('handling event:auth-caducada...');
        $localStorage.ngStorageVIP=false;
        $ionicHistory.clearCache([$state.current.name]).then(function() {
            $state.reload();
        });
    });
    // Handle the login confirmed event raised by the authService
    $scope.$on('event:auth-loginConfirmed', function() {
        $log.debug('handling event:auth-loginConfirmed...');
    });

/*    //On nested view events are fired from Abstrad view, broadcasr events to childs views
    $scope.$on('$ionicView.afterLeave', function(){
        $rootScope.$broadcast('cerrar');
    });*/

    $scope.social_config = social_config;

    $scope.bodShare = function( type ){
        if (type == 'google')
            window.open('https://plus.google.com/113706467770672131735', '_blank', 'location=yes');
        if (type == 'facebook')
            window.open('https://www.facebook.com/Visual-betting-1259051350796387', '_blank', 'location=yes');
        if (type == 'twitter')
            window.open('https://twitter.com/visualbetting', '_blank', 'location=yes');
        if (type == 'email')
            window.open('mailto:'+social_config.email+'?&subject='+social_config.title+'&body='+social_config.description, '_system');
    };

    $scope.rateOurApp = function(){
        $scope.rateDialog();
    };
    $scope.privacy = function(){
        window.open('https://visualbetting-rachas.rhcloud.com/', '_blank', 'location=yes');
    };

    $scope.contactUs = function(){
        window.open('mailto:'+social_config.email+'?subject=Contacting from Visual Betting', '_system');
    };
    
    

    $scope.notification={};
    $scope.notification = {"checked": window.localStorage.getItem("ngnotifya")=== "true"};

    //default configuration
    if (window.localStorage.getItem("ngnotifya")===null){
        $scope.notification.checked=true;
        window.localStorage.setItem("ngnotifya",true );
        if (window.plugins != undefined){
            window.plugins.OneSignal.setSubscription(true);
        }

    }

    $scope.notificame = function(){
        window.localStorage.setItem("ngnotifya",$scope.notification.checked );
        if (window.plugins != undefined){
            window.plugins.OneSignal.setSubscription($scope.notification.checked);
        }
        
    };


});

