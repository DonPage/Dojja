'use strict';

angular.module('dojjaOptionsApp', ['firebase', 'angularMoment'])

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

  .controller('projectsController', function ($scope, $firebaseObject, Firebase, $firebaseArray){

    var ref = new Firebase('https://dojja.firebaseio.com/projects');

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'projects');


    $scope.addNewPage = function (p) {
      //When addNewPage is clicked it passes the project name as argument.
      //Argument 'p' is then used to target the correct project pages.
      var newPageRef = ref.child(p).child('pages').push();
          newPageRef.set({
            _parent: newPageRef.toString().substr(newPageRef.toString().lastIndexOf('/') + 1),
            name: 'Untitled Page',
            href: '/404',
            created: Firebase.ServerValue.TIMESTAMP,
            lastUpdated: Firebase.ServerValue.TIMESTAMP,
            assigned: 'nobody'
          })
    };

    $scope.editIndex = null;

    //shadow will act like angular copy. It will just hold the edits
    //but won't sync with the actual object since the user can cancel edits.
    $scope.shadowPage = '';

    $scope.editPage = function (idx, project, pId) {
      console.log(idx, project, pId);
      var pagesRef = ref.child(project).child('pages').child(pId);

      console.log(pagesRef);

      pagesRef.once('value', function (snap) {
        console.log("snap:", snap.val());
        $scope.shadowPage = snap.val();
      });



      $scope.editIndex = idx;

      //$scope.shadowProject = angular.copy($scope.page)
    };

    $scope.cancelEdit = function () {
      console.log("cancelEdit()");
      $scope.editIndex = null;
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
