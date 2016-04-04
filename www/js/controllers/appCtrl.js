app.controller('AppCtrl', function(
    $rootScope,
    $scope,
    $ionicModal,
    googleLogin,
    timeStorage,$cordovaAppRate
    ) {

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      //  InstagramService.loginCancelled();
        $scope.loginModal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.loginModal.remove();
    });

    // Determine if the user is logged into Instagram
    $scope.isLoggedIn = function() {
    //    return InstagramService.isLoggedIn();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.loginModal.show();
    };

    // Perform the logout action when the user invokes the logout link
    $scope.logout = function() {
       // InstagramService.logout();
    };


    // Perform the OAuth login to GmailService
    $scope.loginToInstagram = function() {
        $scope.loginModal.hide();
        googleLogin.startLogin();
        // SocialAuth.login();
    };

    // Handle the login required event raised by the authService
    $scope.$on('event:auth-loginRequired', function() {
        console.log('handling event:auth-loginRequired  ...');
        //La primera vez mostramos un modal con explicaciones
        if ( timeStorage.firstTime() ){
            $scope.loginModal.show();
        }else{
            //$scope.loginModal.show();
           googleLogin.startLogin();
        }

    });

    // Handle the login confirmed event raised by the authService
    $scope.$on('event:auth-loginConfirmed', function() {
        console.log('handling event:auth-loginConfirmed...');
    });

/*    //On nested view events are fired from Abstrad view, broadcasr events to childs views
    $scope.$on('$ionicView.afterLeave', function(){
        $rootScope.$broadcast('cerrar');
    });*/

    $scope.social_config = social_config;

    $scope.bodShare = function( type ){
        if (type == 'google')
            window.open('https://plus.google.com/share?url='+social_config.url, '_system');
        if (type == 'facebook')
            window.open('https://www.facebook.com/sharer/sharer.php?u='+social_config.url, '_system');
        if (type == 'twitter')
            window.open('https://twitter.com/home?status='+social_config.description, '_system');
        if (type == 'email')
            window.open('mailto:?&subject='+social_config.title+'&body='+social_config.description, '_system');
    };

    $scope.rateOurApp = function(){
  /*      $cordovaAppRate.navigateToAppStore().then(function (result) {
        });
        */
        $cordovaAppRate.promptForRating(true).then(function (result) {
                // success
        });

    };

    $scope.contactUs = function(){
        window.open('mailto:'+social_config.email+'?subject=Contacting from App (bod)', '_system');
    }



});

