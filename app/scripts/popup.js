'use strict';




angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce) {

    function splitURL(url){
      var httpRegex = '/^(https?|ftp):\/\/(.*)/';
      console.log("url:", url);
      var removeHTTP = url.replace(/^(https?|ftp):\/\//, '');
      console.log(removeHTTP);
      return removeHTTP.replace('.', '-');
    }

    /*
      Page Notes Bindings.
     */



    chrome.tabs.getSelected(null,function(tab) {
      var tabLink = tab.url;

      var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
      var path = '[^/]+$';//gets path.


      console.log(tabLink.match(baseURL));
      console.log(tabLink.match(path));
      $scope.tabBase = splitURL(tabLink.match(baseURL)[0]);
      $scope.tabPath = tabLink.match(path)[0] || false;
      console.log("FINAL: ",$scope.tabPath, $scope.tabBase);

      var pageRef = new Firebase('https://dojja.firebaseio.com/projects/'+$scope.tabBase+'/pages/'+$scope.tabPath+'/');

      var syncPageObj = $firebaseObject(pageRef);

      syncPageObj.$bindTo($scope, 'page');

      syncPageObj.$loaded().then(function(data){
        $scope.pageEditorBind = $sce.trustAsHtml($scope.page['editor']);
      });



      /*
        Save page edits.
       */
      $scope.savePageEdits = function () {
        pageRef.update({
          editor: pageEditor.serialize()['element-0'].value
      })
      };


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
      Saving edits (for ).
     */
    $scope.saveEdits = function () {

      console.log("editor:", editor.serialize()['element-0'].value);

      ref.update({
        editor: editor.serialize()['element-0'].value
      });
    }
  });

//editor is for feature
//pageEditor is for page.
var editor = new MediumEditor('.editable', { //feature notes/editor
  targetBlank: true
});

var pageEditor = new MediumEditor('.pageEditable', { //page notes/editor

});



//console.log(editor.serialize());
