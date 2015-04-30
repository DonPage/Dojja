'use strict';




angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce) {

    function splitURL(url){
      var httpRegex = '/^(https?|ftp):\/\/(.*)/';
      console.log("url:", url);
      var removeHTTP = url.replace(/^(https?|ftp):\/\//, '');
      console.log(removeHTTP);

    }

    /*
      Page Notes Bindings
     */

    chrome.tabs.getSelected(null,function(tab) {
      var tabLink = tab.url;

      var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
      var path = '[^/]+$';//gets path.


      console.log(tabLink.match(baseURL));
      console.log(tabLink.match(path));
      $scope.tabBase = splitURL(tabLink.match(baseURL)[0]);
      $scope.tabPath = tabLink.match(path)[0] || false;
      console.log($scope.tabPath, $scope.tabBase);



    });



    /*
      Feature Notes Bindings:
     */
    var featureInfo = JSON.parse(localStorage.getItem('dojjaActive'));

    var ref = new Firebase('https://dojja.firebaseio.com/projects/'+featureInfo.name+'/features/'+featureInfo.featId+'/');

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'feature');

    syncObj.$loaded().then(function (data) { //Load data from firebase.
      $scope.editorBind = $sce.trustAsHtml($scope.feature['editor']); //Bind editor parsed stringy to DOM.


    });


    //$scope.editorBind = $sce.trustAsHtml($scope.page['editor']);




    /*
      Saving edits.
     */
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



//console.log(editor.serialize());
