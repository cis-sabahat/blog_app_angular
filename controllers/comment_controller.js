routerApp.controller('commentCtrl', function($scope, $state, $stateParams, Flash, $http, API, $state, $rootScope, $sessionStorage, $auth, dataFactory) {
	if ($sessionStorage.isLogin)
    {
      $rootScope.current_user = $sessionStorage.current_user
      $rootScope.isLogin = $sessionStorage.isLogin;
    }
	$scope.addComment = function(comment){
		comment["blog_id"] = $stateParams.post_id
		comment["user_id"] = $rootScope.current_user.id
		dataFactory.addComment(comment).then(function (response) {
			if (response.data.errors) {
				Flash.create('danger','something went wrong!');
				getAllPost();
			}
			else{
				$scope.$emit('updateScope', response.data);
			}
    }, function (error) {
			Flash.create('danger', error.message);
    });
	}
	
	$scope.updatePost = function(post){
		dataFactory.updatePost(post).then(function (response) {
			if (response.data.errors) {
				Flash.create('danger',response.data.errors);
			}
			else{
				Flash.create('success',response.data.message);
            	$state.go("posts");
			}
    }, function (error) {
			Flash.create('danger', error.message);
    });

	}

	function getAllPost(){
		dataFactory.getPosts().then(function (response) {
            $scope.posts = response.data
    }, function (error) {
    	Flash.create('danger', error["statusText"]);
    });
	}

	$scope.togglePostForm = function() {
	  $scope.custom = $scope.custom === false ? true: false;
	};

	$scope.delete = function(post_id){
		dataFactory.deletePost(post_id).then(function (response) {
			if (response.data.errors) {
				Flash.create('danger',response.data.errors);
			}
			else{
				Flash.create('success',response.data.message);
	        	$state.go("posts");

			}
    }, function (error) {
		Flash.create('danger', error.message);
    });
	}

	$scope.edit = function(post_id){
		$scope.editable = true;
		dataFactory.getPost(post_id).then(function (response) {
			if (response.data.errors) {
				Flash.create('danger',response.data.errors);
			}
			else{
				$scope.data = response.data;
			}
  	}, function (error) {
		Flash.create('danger', error.message);
  	});
	}
});

