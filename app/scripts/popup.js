'use strict';


angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce, $location) {

    function splitURL(url) {
      var httpRegex = '/^(https?|ftp):\/\/(.*)/';
      console.log("split-url:", url);
      var removeHTTP = url.replace(/^(https?|ftp):\/\//, '');
      console.log("removeHTTP: ", removeHTTP);
      //console.log("replace:", removeHTTP.replace('.', '-'));
      return removeHTTP.split('.').join('-');
    }

    function replaceDots(string){
      //TODO: merge splitURL and replaceDots maybe?
      return string.split('.').join('-');
    }

    /*
     Page Notes Bindings.
     */
    function startPageBindings(base, path) {
      console.log("PageBindings: ", base, path);
      var pageRef = new Firebase('https://dojja.firebaseio.com/projects/' + base + '/pages/' + path + '/');
      var siteRef = new Firebase('https://dojja.firebaseio.com/projects/' + base + '/');


      //TODO: maybe check to see if site name is already there instead of updating it every time?
      siteRef.update({
        name: base
      });


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
      console.log("tabLink:", tabLink);

      var baseURL = '^.+?[^\/:](?=[?\/]|$)';//gets base url
      var path = '[^/]+$';//gets path.


      console.log(tabLink.match(baseURL));
      console.log("PATH: ",tabLink.match(path));
      $scope.tabBase = splitURL(tabLink.match(baseURL)[0]);
      //TODO: FIX THIS! CHEA CHEA. If a URL ends with a '/', it will automatically set it to home.
      //$scope.tabPath = tabLink.match(path) || 'home';
      //return startPageBindings($scope.tabBase, $scope.tabPath);


      $scope.tabPath = tabLink.split('/');

      for (var i = 0; i < $scope.tabPath.length; i++) {
        if ($scope.tabPath[i] === 'http:' || $scope.tabPath[i] === '' || $scope.tabPath[i] === 'https:' || $scope.tabPath[i] === ' ') {
          $scope.tabPath.splice(i, 1);
        }

        console.log("TABPATH:", $scope.tabPath);

      }

      $scope.activeTabPath = $scope.tabPath[$scope.tabPath.length - 1];
      //just going to return the last slug.
      return startPageBindings($scope.tabBase, replaceDots($scope.tabPath[$scope.tabPath.length - 1]));




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
