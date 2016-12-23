routerApp.controller('headerController', function($scope, $state, Flash, $http, API, $state, $rootScope, $sessionStorage, $auth, dataFactory) {
    if ($sessionStorage.isLogin)
    {
      $rootScope.current_user = $sessionStorage.current_user
      $rootScope.isLogin = $sessionStorage.isLogin;
    }
    $scope.signout = function(){
        $sessionStorage.current_user = "";
        $sessionStorage.isLogin =  false;
        $rootScope.current_user = "";
        $rootScope.isLogin = false;
        $state.transitionTo('login');
        $auth.signOut()
    }
})