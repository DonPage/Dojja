'use strict';




angular.module('dojjaPopupApp', ['firebase'])
  .controller('popupController', function ($scope, Firebase, $firebaseObject) {



    var pageInfo = JSON.parse(localStorage.getItem('dojjaActive')) || false;

    var ref = new Firebase('https://dojja.firebaseio.com/projects/'+pageInfo.name+'/pages/'+pageInfo.pageId);

    var syncObj = $firebaseObject(ref);

    console.log('obj:', syncObj);

    syncObj.$bindTo($scope, 'page');

    $scope.saveEdits = function () {

      console.log("editor:", editor.serialize());

      ref.update(editor.serialize());

    }
  });

var editor = new MediumEditor('.editable', {
  targetBlank: true
});

//console.log(editor.serialize());
