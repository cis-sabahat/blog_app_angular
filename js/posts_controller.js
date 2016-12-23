routerApp.controller('postsCtrl', function($scope, $state, Flash, $http, API, $state, $rootScope, $sessionStorage, $auth, dataFactory) {
  console.log(typeof $sessionStorage.isLogin == 'undefined' && !$sessionStorage.isLogin)
	get_all_post();
  $scope.isLogin = (typeof $sessionStorage.isLogin == 'undefined' && !$sessionStorage.isLogin) ? false : true
	function get_all_post(){
	  dataFactory.getAllPosts().then(function (response) {
	    $scope.posts = response.data;
	    }, function (error) {
	    Flash.create('danger', error.message);
	    });
    }

    $scope.like = function(post,classe){
      console.log(classe)
      if(classe){

        $scope.unlike(post)

      } else {
        	like = {'likeable_id': post.id, 'likeable_type': 'Blog','user_id':$rootScope.current_user.id}
        	dataFactory.likePost(like).then(function (response) {
          		if (response.data.errors) {
            		Flash.create('danger',"Something went wrong");
          		}
          		else{
                $scope.data = response.data;
            		get_all_post();
          		}
        	}, function (error) {
          		Flash.create('danger', error.message);
        	});
     }
  	}
    
    $scope.unlike = function(post){
      like = $scope.getUserLike(post)[0]
    	dataFactory.unlikePost(like.id).then(function (response) {
      	if (response.data.errors) {
        	Flash.create('danger',response.data.errors);
      	}
      	else{
        	$scope.data = response.data;
        	get_all_post();
      		}
    	}, function (error) {
      		Flash.create('danger', "Something wen wrong");
    	});
  	}
  	
  	$scope.check_like = function(post){
      console.log(post)
    	ary = post.likes
    	for(i=0; i< ary.length; i++){
      		if(ary[i].user_id == $rootScope.current_user.id){
        		return true
        		break;
      		}
    	}
  	}

    $scope.getUserLike = function(post){
      ary = post.likes
      result = $.grep(ary, function(e){ return e.user_id == $rootScope.current_user.id; });
      return result
    }
  	$scope.$on('updateScope',function handleUpdateScope(event, newValue){
			$scope.post.comments.push(newValue)
		});
});
