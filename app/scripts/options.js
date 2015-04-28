'use strict';

angular.module('dojjaOptionsApp', ['firebase', 'angularMoment'])

  .controller('formController', function ($scope, Firebase){

    //regex stuff;
    var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
    var path = '[^/]+$';//gets path.

    var projectsRef = new Firebase('https://dojja.firebaseio.com/projects');

    $scope.addProject = function (url, img) {
      console.log('addProject()', name, url, img);
      //you can't save url's into firebase as a path so we must take away some stuff.
      var extractBase = url.match(baseURL);
      var splitCOM = extractBase[0].split('.'); //take away the .com
      console.log(splitCOM);
      var splitHTTP = splitCOM[0].split('//');
      console.log(splitHTTP);


      projectsRef.child(splitHTTP[1]).update({
        name: splitHTTP[1],
        url: extractBase[0],
        img: img,
        pages: ' ',
        features: ' '
      });

    };

  })

  .controller('projectsController', function ($scope, $firebaseObject, Firebase, $firebaseArray){

    var ref = new Firebase('https://dojja.firebaseio.com/projects');

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'projects');


    $scope.addNewFeature = function (p) {
      //When addNewFeature is clicked it passes the project name as argument.
      //Argument 'p' is then used to target the correct project pages.
      var newPageRef = ref.child(p).child('features').push();
          newPageRef.set({
            parent: newPageRef.toString().substr(newPageRef.toString().lastIndexOf('/') + 1),
            name: 'Untitled Feature',
            created: Firebase.ServerValue.TIMESTAMP,
            lastEdit: Firebase.ServerValue.TIMESTAMP,
            assigned: 'nobody',
            progress: 'unfinished.'
          })
    };

    $scope.editIndex = null;

    //shadow will act like angular copy. It will just hold the edits
    //but won't sync with the actual object since the user can cancel edits.

    $scope.shadowPage = '';


    $scope.editFeature = function (idx, project, pId) {
      console.log(idx, project, pId);
      var featuresRef = ref.child(project).child('features').child(pId);

      console.log(featuresRef);

      featuresRef.once('value', function (snap) {
        console.log("snap:", snap.val());
        $scope.shadowPage = snap.val();

        $scope.saveName = $scope.shadowPage.name;
        $scope.saveAssigned = $scope.shadowPage.assigned;
        //$scope.saveHref = $scope.shadowPage.href;
      });



      $scope.editIndex = idx;

      //$scope.shadowProject = angular.copy($scope.page)
    };

    $scope.cancelEdit = function () {
      console.log("cancelEdit()");
      $scope.editIndex = null;
    };

    $scope.saveEdits = function (name, pId, sName, sAssigned, sHref) {
      console.log(name, pId);
      var featuresRef = ref.child(name).child('features').child(pId);
      featuresRef.update({
        assigned: sAssigned,
        name: sName,
        //href: sHref,
        lastEdit: Firebase.ServerValue.TIMESTAMP
      });
      $scope.editIndex = null;
    };

    //deleting page:
    $scope.trashFeature = function (name, id) {
      console.log("id:", name, id);
      ref.child(name).child('features').child(id).remove();
    };


    //active feature.
    //setting a feature to active will send it to the chrome popup.
    $scope.setActive = function (name, id) {

      var dojjaFeature = {name: name, featId: id};
      var stringy = JSON.stringify(dojjaFeature);
      localStorage.setItem('dojjaActive', stringy);

      ref.child(name).child('features').child(id).update({
        active: true
      });


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

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');

  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});