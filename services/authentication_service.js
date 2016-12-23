my_app.service("AuthenticationService",['$rootScope','$sessionStorage','$location','$http', function($rootScope,$sessionStorage,$location,$http){
    this.setCredentials = function(data){
    $sessionStorage.globals = { currentUser: {
                  username: data["data"]["data"]["user_name"],
                  authdata: data["data"]["data"]["id"]
                }
            };

      $sessionStorage.isLogin = true;
      
    }
    this.login = function(credentails){
     return $http({method: 'post', url: "http://localhost:3000/users/check_login", data: {"credentails" : credentails}})
            .then(function successCallback(response) {
                return response
            }, function errorCallback(response) {
               return response["data"]["errors"];
              // $location.path('/error');
            });
    }
    this.clearCredentials = function(){
      $sessionStorage.globals = {}
      $sessionStorage.isLogin = false;
      $rootScope.globals = {}
      $rootScope.isLogin = false;
    }


}]);