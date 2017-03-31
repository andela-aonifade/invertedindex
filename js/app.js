
  angular.module('InvertedIndex',[])
    .controller('InputController', function($scope){
    $scope.title = "Welcome to DPlex";
    let invIndex = new InvertedIndex();

    $scope.fileUploaded = function (files) {
        $scope.isFileUploaded = true;
    }
  });
