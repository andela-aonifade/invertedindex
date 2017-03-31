'use strict';

const hasProperty = Object.prototype.hasOwnProperty;

class InvertedIndex {
  /**
    * constructor method
  */
  constructor() {
    this.filesIndexed = {};
  }

  /**
   * createIndex function is used to get all the index
   * @param {object} inputData- the json data to index
   * @param {string} filename- the name of the file to be indexed
   * @return {boolean} true or false if the createIndex was successful
   */
  createIndex(inputData, filename) {
    try {
      inputData = JSON.parse(inputData);
    } catch(exception) {
      return false;
    }

    this.filesIndexed[filename] = {};
    if(!this.prepareJsonData(inputData, filename)) {
      delete this.filesIndexed[filename];
      return false;
    }
    return true;
  }

  /**
   * prepareJsonData gets the json ready for indexing by tokenizing statements
   * @param {object} inputData - the inputData that has been read from the file
   * @param {string} filename - the name of the file uploaded
   * @return {boolean} value to indicate if the index was successfully created
  */
  prepareJsonData(inputData, filename) {
    let words = [], documentNum = 0, aDocument = [];
    for(let eachIndex in inputData) {
      aDocument = inputData[eachIndex];
      if(hasProperty.call(aDocument, 'text') &&
        hasProperty.call(aDocument, 'title')) {
          words.push(this.getDocumentTokens(aDocument, documentNum));
      } else {
        return false;
      }
      documentNum++;
    }
    this.filesIndexed[filename].numOfDocs = documentNum;
    this.filesIndexed[filename].index = this.constructIndex(words);
    return true;
  }

  /**
   * getDocumentTokens method gets all the tokens in each document
   * and composes an object out of them
   * @param {object} docDetails contains the title and text of the document
   * @param {integer} documentNum, the number of the document
   * @return {object}
   */
  getDocumentTokens(docDetails, documentNum) {
    let textTokens = this.tokenize(docDetails.text + ' ' + docDetails.title);
    return {documentNum, textTokens};
  }

  /**
   * tokenize: method removes special characters and converts the text to
   * lowercase and then returns the array of words
   * @param {string} text- the text to be tokenized
   * @return {array} array of words in the documents
  */
  tokenize(text) {
    text = text.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g, '');
    return text.toLowerCase().split(' ');
  }

  /**
   * constructIndex method searches through the array of documents objects and
   * dentifies the words in each
   * @param {array} documents - array of objects, each obect is a document
   * @return {object} objects of tokens. Each token is a key in the object and
   * contains an array of documents in which it was found
  */
  constructIndex(documents) {
    let indexWords = {};
    documents.forEach((eachDoc) => {
      eachDoc.textTokens.forEach((token) => {
        if(!hasProperty.call(indexWords, token)) {
          indexWords[token] = [];
        }
        if(indexWords[token].indexOf(eachDoc.documentNum) === -1) {
          indexWords[token].push(eachDoc.documentNum);
        }
      });
    });
    return indexWords;
  }

  /**
   * getIndex method returns the indexed words and the documents that were found
   * @param {string} filename: name of the file to get its index
   * @return {Object} the words index
  */
  getIndex(filename) {
    let file = this.filesIndexed[filename];
    return !file.index ? false : file.index;
  }

  /**
   * searchIndex searches the indexed words to determine the
   * documents that the searchterms can be found
   * @params searchTerm {string, array} the search query
   * @params filename {string}- the name of the file to search its index
   * @return {object|boolean} it returns boolean if the searchTerm is empty and
   * it returns object if it is not. Each index is each searcykeyword.
   * Each with an array value of the document index
  */
  searchIndex(searchTerm, filename) {
    if((typeof searchTerm === 'string' && searchTerm.trim() === '') ||
      (typeof searchTerm === 'object' && searchTerm.length === 0) ||
      searchTerm === undefined) {
        return false;
    }

    let result = [];
    if(filename === 'all') {
      for(let eachFile in this.filesIndexed) {
        result.push({
          indexes: this.getSearchResults(searchTerm, eachFile),
          searchedFile: eachFile,
          documents: this.getDocuments(eachFile)
        });
      }
    } else {
      result.push({
        indexes: this.getSearchResults(searchTerm, filename),
        searchedFile: filename,
        documents: this.getDocuments(filename)
      });
    }
    return result;
  }

  /**
   * getSearchResults method checks the index of the file and returns the result
   * @param searchTokens {string} - the search query of one or more words
   * @param filename {string} - the name of the file
   * @return {object} - an object with the found words as keys
  */
  getSearchResults(searchTokens, filename) {
    let indexToSearch = this.getIndex(filename), result = {};
    this.tokenize(searchTokens).forEach((eachSearchWord) => {
      if(indexToSearch[eachSearchWord]) {
        result[eachSearchWord] = indexToSearch[eachSearchWord];
      }
    });
    return result;
  }

  /**
   * getDocuments get an array of the documents index e.g [0, 1, 2, 3]
   * @param {string} - name of the file to get its document
   * @return {array} an array of the documents index
  */
  getDocuments(filename) {
    let docs = [];
    for(let i = 0; i < this.filesIndexed[filename].numOfDocs; i++) {
      docs.push(i);
    }
    return docs;
  }
}
