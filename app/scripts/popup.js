'use strict';




angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject, $sce) {



    var pageInfo = JSON.parse(localStorage.getItem('dojjaActive')) || false;

    var ref = new Firebase('https://dojja.firebaseio.com/projects/'+pageInfo.name+'/pages/'+pageInfo.pageId);

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'page');

    syncObj.$loaded().then(function (data) {
      console.log(data);
      $scope.editorBind = $sce.trustAsHtml($scope.page['editor']);
    });

    //$scope.editorBind = $sce.trustAsHtml($scope.page['editor']);


    $scope.saveEdits = function () {

      console.log("editor:", editor.serialize()['element-0'].value);

      ref.update({
        editor: editor.serialize()['element-0'].value
      });

      console.log(JSON.parse(editor.serialize()['element-0'].value));

    }
  });

var editor = new MediumEditor('.editable', {
  targetBlank: true
});

//console.log(editor.serialize());
