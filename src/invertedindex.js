
const hasProperty = Object.prototype.hasOwnProperty;
let instance = null;

class InvertedIndex {
  /**
    * constructor method
  */
  constructor() {
    if (!instance) {
      instance = this;
      this.filesIndexed = {};
      this.inputData = {};
      this.error = {};
    }
    return instance;
  }

  /**
   * readFile function is used to get all the index
   * @param {object} inputData - the json data to index
   * @return {reject(false)} false - When file is of bad extent of
   * invalid json format
   * @return {resolve(true)} true - When file is of the right extension structure
   */
  readFile(inputData) {
    return new Promise((resolve, reject) => {
      if (!inputData.name.match(/\.json$/)) {
        return reject(false);
      }
      const readFile = new FileReader();
      readFile.readAsText(inputData);
      readFile.onload = (file) => {
        const content = file.target.result;
        try {
          return resolve(JSON.parse(content));
        } catch (exception) {
          return reject(false);
        }
      };
    });
  }

  /**
   * prepareJsonData gets the json ready for indexing by tokenizing statements
   * @param {object} inputData - the json data to index
   * @param {string} filename - the name of the file to be indexed
   * @return {boolean} true or false if the createIndex was successful
  */
  createIndex(inputData, filename) {
    this.filesIndexed[filename] = {};
    const words = [];
    let documentNum = 0;
    try {
      if (Object.keys(inputData).length < 1) {
        delete this.filesIndexed[filename];
        this.error.status = true;
        this.error.message = 'File contains no document';
        throw this.error;
      }
      Object.keys(inputData).forEach((eachIndex) => {
        if (!this.validateFile(inputData[eachIndex])) {
          delete this.filesIndexed[filename];
          this.error.status = true;
          this.error.message = 'Incorrect Document Structure';
          throw this.error;
        }
        words.push(this.getDocumentTokens(inputData, documentNum));
        documentNum += 1;
      });
      this.filesIndexed[filename].numOfDocs = documentNum;
      this.filesIndexed[filename].index = this.constructIndex(words);
      return true;
    } catch (err) {
      if (this.error.status) {
        return false;
      }
    }
  }
  /**
   *
   * @param {object} docToValidate - The json data to be validated
   * @param {boolean} true or false - Depending on whether the document
   * has the right structures or not.
   */
  validateFile(docToValidate) {
    if (!docToValidate.text || !docToValidate.title) {
      return false;
    }
    return true;
  }
  /**
   * getDocumentTokens method gets all the tokens in each document
   * and composes an object out of them
   * @param {object} docDetails contains the title and text of the document
   * @param {integer} documentNum, the number of the document
   * @return {object} containing the document Number and the token
   */
  getDocumentTokens(docDetails, documentNum) {
    const textTokens = this
      .tokenize(
        `${docDetails[documentNum].text} ${docDetails[documentNum].title}`
      );
    return { documentNum, textTokens };
  }

  /**
   * tokenize: method removes special characters and converts the text to
   * lowercase and then returns the array of words
   * @param {string} text- the text to be tokenized
   * @return {array} array of words in the documents
  */
  tokenize(text) {
    text = text.replace(/[^A-Za-z\s-]/g, '');
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
    const indexWords = {};
    documents.forEach((eachDoc) => {
      eachDoc.textTokens.forEach((token) => {
        if (!hasProperty.call(indexWords, token)) {
          indexWords[token] = [];
        }
        if (indexWords[token].indexOf(eachDoc.documentNum) === -1) {
          indexWords[token].push(eachDoc.documentNum);
        }
      });
    });
    return indexWords;
  }

  /**
   * getIndex method returns the indexed words and the documents that were found
   * @param filename {string} : name of the file to get its index
   * @return {Object} or {boolean} the words index
  */
  getIndex(filename) {
    try {
      if (!this.filesIndexed[filename]) {
        this.error.status = false;
        this.error.message = 'File selected not indexed';
        throw this.error;
      }
      const file = this.filesIndexed[filename];
      return file.index;
    } catch (err) {
      return this.error.status;
    }
  }

  /**
   * searchIndex searches the indexed words to determine the
   * documents that the searchterms can be found
   * @param {string, array} searchTerm - the search query
   * @param {string} filename - the name of the file to search its index
   * @return {object|boolean} it returns boolean if the searchTerm is empty and
   * it returns object if it is not. Each index is each searcykeyword.
   * Each with an array value of the document index
  */
  searchIndex(searchTerm, filename) {
    if ((typeof searchTerm === 'string' && searchTerm.trim() === '') ||
      (typeof searchTerm === 'object' && searchTerm.length === 0) ||
      searchTerm === undefined) {
      return false;
    }
    const result = [];
    if (filename === 'all') {
      Object.keys(this.filesIndexed).forEach((eachFile) => {
        result.push({
          indexes: this.getSearchResults(searchTerm, eachFile),
          searchedFile: eachFile,
          documents: this.getDocuments(eachFile)
        });
      });
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
   * @param searchTokens {searchTokens} - the search query of one or more words
   * @param filename {string} - the name of the file
   * @return {object} - an object with the found words as keys
  */
  getSearchResults(searchTokens, filename) {
    const indexToSearch = this.getIndex(filename), result = {};
    this.tokenize(searchTokens).forEach((eachSearchWord) => {
      if (indexToSearch[eachSearchWord]) {
        result[eachSearchWord] = indexToSearch[eachSearchWord];
      }
    });
    return result;
  }

  /**
   * getDocuments get an array of the documents index e.g [0, 1, 2, 3]
   * @param {filename} - name of the file to get its document
   * @return {array} an array of the documents index
  */
  getDocuments(filename) {
    const docs = [];
    for (let i = 0; i < this.filesIndexed[filename].numOfDocs; i += 1) {
      docs.push(i);
    }
    return docs;
  }

}
