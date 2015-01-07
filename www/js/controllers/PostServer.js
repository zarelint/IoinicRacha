'use strict';

/*
app.factory('Post' , function ($resource) {
    return $resource('https://boiling-fire-888.firebaseio.com/posts/:id.json');
});
*/

app.factory('Post', function ($firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebase(ref.child('posts')).$asArray();

  return {
    all: posts,
    create: function (post) {
      return posts.$add(post);
    },
    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    delete: function (post) {
      return posts.$remove(post);
    }
  };
});
// inyecta el service Post en el controller
app.controller('PostCtrl', function ($scope, Post) {

  $scope.posts = Post.all;
  $scope.post = { url: 'http://', title: ''};

  $scope.submitPost = function () {
    Post.create($scope.post).then(function () {
      $scope.post = { url: 'http://', title: ''};
    });
  };
  $scope.deletePost = function (post) {
    Post.delete(post);
  };


});
