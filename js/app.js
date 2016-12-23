var routerApp = angular.module('routerApp', ['ui.router','ngStorage','ng-token-auth','ngFlash', 'ngMessages', 'ngFileUpload']);
routerApp.config(function($stateProvider, $urlRouterProvider, $authProvider, API, $locationProvider){
	$urlRouterProvider.otherwise('/home');
	$stateProvider
		.state('home',{
			url: '/home',
			views: {
        'content@': {
          templateUrl: 'partial-posts.html',
          controller: 'postsCtrl'
        },
        'footer@': {
          templateUrl: 'partials/footer.html',
          controller: 'FooterController'
        }
      },
      data: {
        requireLogin: false
      }
		})
		.state('home.list',{
			url: '/list',
			templateUrl: 'partial-list.html',
			controller: function($scope){
				$scope.test = ["hello"];
			}
		})
		.state('home.paragraph',{
			url: '/all_post',
      views: {
        'content@': { 
            templateUrl: 'partial-posts.html',
            controller: 'postsCtrl'
        }
      },
      data: {
        requireLogin: false
      },
      resolve: {
        auth: function($auth) {
          return $auth.validateUser();
        },
      }
		})
		.state('login',{
			url: '/login',
			views: {
        'content@': { templateUrl: 'login.html' },
        'columnOne@login': { templateUrl: 'partial_login.html' }
      },
      data: {
        requireLogin: false
      }
		})
    .state('posts',{
      url: '/posts',
      views: {
        'content@': { templateUrl: 'posts.html', controller: 'postCtrl' }
      },
      data: {
        requireLogin: true
      }
    })
    .state('post', {
      url: '/post/:post_id/',
      templateUrl: 'post.html',
      views: {
        'content@': { templateUrl: 'post.html',
          controller: function($scope, dataFactory, $stateParams){
                        getPost();
                        function getPost(){
                          dataFactory.getPost($stateParams.post_id).then(function (response) {
                            $scope.post = response.data;
                          }, function (error) {
                            $scope.error = 'Unable to load customer data: ' + error.message;
                          });
                        }
                      } 
          },
        'form@post': { 
            templateUrl: 'edit_post_form.html',
            controller: 'postCtrl',
        }
      },
    data: {
      requireLogin: false
    }
    })
    .state('profile',{
      url: '/profile',
      views: {
        'content@': {
          templateUrl: 'profile.html'
        }
      },
      data: {
        requireLogin: true
      },
    })
    .state('profile.password',{
      url: '/profile/password',
      views: {
        'content@': {
          templateUrl: 'password.html'
        }
      },
    data: {
      requireLogin: true
    }
    })
    .state('profile.account',{
      url: '/profile/account',
      views: {
        'content@': {
          templateUrl: 'account.html'
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state('sign_up',{
      url: '/sign_up',
      views: {
        'content@': { templateUrl: 'partial-list.html' },
      },
      data: {
        requireLogin: false
      }
    })
    .state('reset_password',{
      url: '/reset_password',
      views: {
        'content@': { templateUrl: 'reset_password.html' },
      },
      data: {
        requireLogin: true
      }
    })
    $authProvider.configure({
      apiUrl: 'http://localhost:3000',
      tokenFormat: {
      "access-token": "{{ token }}",
      "token-type":   "Bearer",
      "client":       "{{ clientId }}",
      "expiry":       "{{ expiry }}",
      "uid":          "{{ uid }}"
      }
    });
});

routerApp.constant('API', 'http://localhost:3000/api/')

routerApp.run(['$window', '$rootScope', '$state', '$sessionStorage', function ($window, $rootScope, $state, $sessionStorage) {
  $rootScope.$on('$stateChangeStart', function(event, $stateProvider){
    var requireLogin  = $stateProvider.data.requireLogin;
    if(requireLogin && typeof $sessionStorage.isLogin == 'undefined' && !$sessionStorage.isLogin)
    {
      event.preventDefault(); 
      $state.go('login')
    }
  })
  $rootScope.goBack = function(){
    $window.history.back();
  }
}]);

routerApp.directive("compareTo", function() {
  return {
    require: "ngModel",
    restrict: 'E',
    scope: {
        otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
            return modelValue == scope.otherModelValue;
        };
        scope.$watch("otherModelValue", function() {
            ngModel.$validate();
        });
    }
  }
});

routerApp.controller('IndexCtrl', function($scope, $auth, $state,$rootScope,$sessionStorage) {
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
    
  });

routerApp.directive('ngConfirmClick', [function(){
  return {
      link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || "Are you sure?";
          var clickAction = attr.confirmedClick;
          element.bind('click',function (event) {
              if ( window.confirm(msg) ) {
                  scope.$eval(clickAction)
              }
          });
      }
  };
}]);
