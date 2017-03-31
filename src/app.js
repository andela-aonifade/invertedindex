
const dPlexApp = angular.module('invertedIndex', []);


dPlexApp.controller('dPlexController', ['$scope', ($scope) => {
  $scope.title = 'DPlex - Inverted Index for All';
  const invIndex = new InvertedIndex();
  $scope.uploadedFiles = {};
  $scope.allFlag = false;
  $scope.allFilesIndexed = {};
  /**
  $scope.createIndex is executed when the createIndex button is clicked
  */
  $scope.createIndex = () => {
    let fileChoice = $scope.uploadSelected;
    if(!fileChoice) {
      showMessage('Select a file to get index');
      return false;
    }
    //If index was created for that file
    if(invIndex.createIndex($scope.uploadedFiles[fileChoice].text, fileChoice)) {
      //Gets the indexed words
      const indexes = invIndex.getIndex(fileChoice);
      $scope.indexDisplay = true;
      $scope.indexed = [
        {
          indexes: indexes,
          documents: invIndex.getDocuments(fileChoice),
          indexedFile: fileChoice
        }
      ];
      //Keeps track of files that have been indexed
      $scope.allFilesIndexed[fileChoice] = true;
      let fileNamesIndexed = Object.keys($scope.allFilesIndexed);
      $scope.uploadToSearch = fileNamesIndexed[fileNamesIndexed.length-1];
      /*To check if two files or above have been indexed
      so that an option to search all files can be added*/
      if(Object.keys($scope.allFilesIndexed).length > 1) {
        $scope.allFlag = true;
      }

    } else {
      //The file was not indexed because it is invalid;
      delete $scope.uploadedFiles[fileChoice];
      showMessage('Your json file is invalid, make sure each element has title and text property');
    }

  };

  $scope.searchIndex = function() {
    let fileChoice = $scope.uploadToSearch;
    $scope.searchQuery = $scope.searchTerm;

    if(!$scope.uploadedFiles.hasOwnProperty(fileChoice) && fileChoice !== 'all') {
      showMessage('Select a file that has been indexed');
      return false;
    }

    let result = invIndex.searchIndex($scope.searchQuery, fileChoice);

    if(!result) {
      showMessage('Invalid search query');
      return false;
    }

    $scope.indexed = result;
    $scope.indexDisplay = false;
  };

  /**
   * readJson function is used to read the content of a file
   * @param {object} dom is an object representing the dom element the change event was attached to
  */
  $scope.readJson = (dom) => {
    //console.log(dom);
    for(let i = 0; i < dom.target.files.length; i++)
    {
      let fileDetails = dom.target.files[i];
      //check if filename ends in json
      if(!fileDetails.name.match(/\.json$/)) {
        showMessage('Invalid file. You can only upload JSON');
      } else {
        let readFile = new FileReader();
        readFile.readAsText(fileDetails);
        readFile.onload = (file) => {
          let content = file.target.result;
          try {
            JSON.parse(content);
          } catch(exception) {
            showMessage('Invalid JSON file');
            return false;
          }
          $scope.uploadedFiles[fileDetails.name] = {};
          $scope.uploadedFiles[fileDetails.name].text = content;
          let fileNames = Object.keys($scope.uploadedFiles);
          $scope.uploadSelected = fileNames[fileNames.length - 1];

          //to make angular update the view
          $scope.$apply();
        };
      }
    }
  };

  $scope.isEmpty = function(value) {
    return Object.keys(value).length === 0;
  };

  function showMessage(message) {
    $scope.message = message;
    $('#response-modal').modal();
    $scope.$apply();
  }
  document.getElementById('uploadfile').addEventListener('change', $scope.readJson);
}]);
