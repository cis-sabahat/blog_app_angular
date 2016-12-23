routerApp.factory('dataFactory', ['$http', 'API', function($http, API) {
  var dataFactory = {};
  dataFactory.getPosts = function () {
    return $http.get(API + 'blogs');
  };

  dataFactory.getAllPosts = function () {
    return $http.get(API + 'blogs/all_posts');
  };

  dataFactory.getPost = function (id) {
    return $http.get(API + 'blogs/' + id);
  };

  dataFactory.insertPost = function (cust) {
    return $http.post(API + 'blogs/', cust);
  };

  dataFactory.updatePost = function (cust) {
    return $http.put(API + 'blogs/' + cust.id, cust)
  };

  dataFactory.deletePost = function (id) {
    return $http.delete(API + 'blogs/' + id);
  };

  dataFactory.addComment = function (comment) {
    return $http.post(API + 'comments/', comment);
  };

  dataFactory.likePost = function (like) {
    return $http.post(API + 'likes/', like);
  };

  dataFactory.unlikePost = function (id) {
    return $http.delete(API + 'likes/'+ id);
  };

  return dataFactory;
}]);