routerApp.controller('authenticationCtrl', function($scope, $auth, $state,$rootScope, $sessionStorage, Flash, Upload) {
  $scope.clear_credentials = function(){
    $sessionStorage.current_user = "";
    $sessionStorage.isLogin = false;
  }

  $scope.handleRegBtnClick = function() {
    $auth.submitRegistration($scope.registrationForm)
  };

  $scope.$on('auth:registration-email-success', function(ev, message) {
    $rootScope.message  = "A registration email was sent to " + message.email;
    $state.transitionTo('login');
  });

  $scope.$on('auth:registration-email-error', function(ev, reason) {
      $rootScope.message = "Registration failed: " + reason.errors["full_messages"];
      $state.transitionTo('login');
  });

  $scope.$on('auth:email-confirmation-success', function(ev, user) {
      $rootScope.message = "Welcome, "+user.email+". Your account has been verified.";
      $state.transitionTo('login');
  });

  //login
  $scope.handleLoginBtnClick = function() {
    $auth.submitLogin($scope.credentails).then(function(resp) {
          console.log(resp)
        })
  };

  $scope.$on('auth:login-success', function(ev, user) {
    console.log(user)
    $scope.set_credentials(user);
    $rootScope.current_user = user;
    $rootScope.isLogin = true;
    $rootScope.message = 'Welcome '+ user.email
    $state.transitionTo('home.paragraph');
  });

  $scope.$on('auth:login-error', function(ev, reason) {
    Flash.create('danger', 'auth failed because '+ reason.errors[0]);
  });

  $scope.$on('auth:logout-error', function(ev, reason) {
    alert('logout failed because ' + reason.errors[0]);
  });

  $scope.set_credentials = function(user){
    $sessionStorage.current_user = user
    $sessionStorage.isLogin = true;
  }

  // password update
  $scope.handleUpdatePasswordBtnClick = function() {
    $auth.updatePassword($scope.updatePasswordForm)
  };

  $scope.$on('auth:password-change-success', function(ev) {
    console.log(ev)
    $scope.set_credentials(ev.data)
    Flash.create('Success',ev.data.message);
    $state.go('home');
  });

  $scope.$on('auth:password-change-error', function(ev, reason) {
    Flash.create('danger',reason.errors);
  });
  
  // account update
  $scope.handleUpdateAccountBtnClick = function() { 
    console.log($scope.updateAccountForm)
    $auth.updateAccount($scope.updateAccountForm)
  }

  $scope.$on('auth:account-update-success', function(ev) {
        $state.go('home');
    alert("Your account has been successfully updated!");
  });

  $scope.$on('auth:account-update-error', function(ev, reason) {
    alert("Registration failed: " + reason.errors[0]);
  });

  $scope.handlePwdResetBtnClick = function() {
    console.log("absdhadfhas","dasdas")
    $auth.requestPasswordReset($scope.pwdResetForm)
  }
  
  $scope.$on('auth:password-reset-request-success', function(ev, data) {
    Flash.create('Success',"Password reset instructions were sent to " + data.email);
    $state.go('home');
  });

  $scope.$on('auth:password-reset-confirm-error', function(ev, reason) {
    alert("Unable to verify your account. Please try again.");
  });
});
