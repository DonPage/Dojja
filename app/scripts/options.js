'use strict';

angular.module('dojjaOptionsApp', ['firebase'])

  .controller('formController', function ($scope, Firebase){

    var projectsRef = new Firebase('https://dojja.firebaseio.com/projects');

    $scope.addProject = function (name, url, img) {
      console.log('addProject()', name, url, img);
      projectsRef.child(name).update({
        name: name,
        url: url,
        img: img,
        pages: ' '
      });

    };

  })

  .controller('projectsController', function ($scope, $firebaseObject, Firebase){

    var ref = new Firebase('https://dojja.firebaseio.com/projects');

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'projects');


    $scope.addNewPage = function (p) {
      console.log("index:", p);
      ref.child(p).child('pages').push({
        name: 'new page',
        created: Firebase.ServerValue.TIMESTAMP,
        assigned: 'nobody'
      })


    };

  })



  .controller('optionsController', function ($scope, $firebaseObject) {

    $scope.message = 'DOJJA BRAH';

    $scope.testInput = 'something';

    var ref = new Firebase('https://dojja.firebaseio.com');

    var syncObj = $firebaseObject(ref);

    syncObj.$bindTo($scope, 'data');

    syncObj.$loaded().then(function (data) {
      console.log(data.number);
      $scope.data.number ++;
      console.log(data.number, 'after');
    });




  });
