'use strict';




angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce) {



    var featureInfo = JSON.parse(localStorage.getItem('dojjaActive'));

    var ref = new Firebase('https://dojja.firebaseio.com/projects/'+featureInfo.name+'/features/'+featureInfo.featId+'/');

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'page');

    syncObj.$loaded().then(function (data) { //Load data from firebase.
      $scope.editorBind = $sce.trustAsHtml($scope.page['editor']); //Bind editor parsed stringy to DOM.


    });


    //$scope.editorBind = $sce.trustAsHtml($scope.page['editor']);


    $scope.saveEdits = function () {

      console.log("editor:", editor.serialize()['element-0'].value);

      ref.update({
        editor: editor.serialize()['element-0'].value
      });


    }
  });

var editor = new MediumEditor('.editable', {
  targetBlank: true
});

chrome.tabs.getSelected(null,function(tab) {
  var tabLink = tab.url;
  console.log(tabLink);

  var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
  var path = '[^/]+$';//gets path.


  console.log(tabLink.match(baseURL));
  console.log(tabLink.match(path));

});

//console.log(editor.serialize());
