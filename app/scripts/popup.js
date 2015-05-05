'use strict';


angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce) {

    function splitURL(url) {
      var httpRegex = '/^(https?|ftp):\/\/(.*)/';
      console.log("split-url:", url);
      var removeHTTP = url.replace(/^(https?|ftp):\/\//, '');
      console.log("removeHTTP: ", removeHTTP);
      console.log("replace:", removeHTTP.replace('.', '-'));
      return removeHTTP.replace('.', '-');
    }

    /*
     Page Notes Bindings.
     */
    function startPageBindings(base, path) {
      console.log("PageBindings: ", base, path);
      var pageRef = new Firebase('https://dojja.firebaseio.com/projects/' + base + '/pages/' + path + '/');

      var syncPageObj = $firebaseObject(pageRef);

      syncPageObj.$bindTo($scope, 'page');

      syncPageObj.$loaded().then(function (data) {
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
    }


    chrome.tabs.getSelected(null, function (tab) {
      var tabLink = tab.url;

      var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
      var path = '[^/]+$';//gets path.


      console.log(tabLink.match(baseURL));
      console.log(tabLink.match(path));
      $scope.tabBase = splitURL(tabLink.match(baseURL)[0]);
      $scope.tabPath = tabLink.match(path) || 'home';

      return startPageBindings($scope.tabBase, $scope.tabPath);


    });


    /*
     Feature Notes Bindings:
     */
    var featureInfo = JSON.parse(localStorage.getItem('dojjaActive'));

    var ref = new Firebase('https://dojja.firebaseio.com/projects/' + featureInfo.name + '/features/' + featureInfo.featId + '/');

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
  targetBlank: true,
  disablePlaceholders: true,
  buttons: ['bold', 'italic', 'unorderedlist', 'justifyLeft', 'justifyCenter', 'justifyRight']
});

var pageEditor = new MediumEditor('.pageEditable', { //page notes/editor
  targetBlank: true,
  disablePlaceholders: true,
  buttons: ['bold', 'italic', 'unorderedlist', 'justifyLeft', 'justifyCenter', 'justifyRight']
});


//console.log(editor.serialize());
