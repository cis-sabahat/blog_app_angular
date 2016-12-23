routerApp.controller('postCtrl', function($scope, $state, Flash, $http, API, $state, $rootScope, $sessionStorage, $auth, dataFactory) {
	$scope.custom = true;
	$scope.editable = false;

	// getAllPost();
	if ($sessionStorage.isLogin)
    {
      $rootScope.current_user = $sessionStorage.current_user
      $rootScope.isLogin = $sessionStorage.isLogin;
    }

	$scope.submitPost = function(post){
		console.log(post)
		dataFactory.insertPost(post).then(function (response) {
				if (response.data.errors) {
					Flash.create('danger','something went wrong!');
				}
				else{
					$scope.custom = true;
					Flash.create('success','Post saved successfully');
					console.log($rootScope.current_user)
					// $scope.data
					// $scope.myform.$setPristine();
					getAllPost();
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

	$scope.getAllPost = function(){
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

	$scope.$on('updateScope',function handleUpdateScope(event, newValue){
		$scope.post.comments.push(newValue)
	});

	
});

