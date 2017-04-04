
//  book with valid contents
const validBook = require('../samples/motivations.json');
//  book with invalid content
const wrongFormat = require('../samples/wrongformat.json');
//  empty book
const emptyFile = require('../samples/empty.json');
// empty book
const badFile = require('../samples/badfile.json');
// book with few words
const books = require('../samples/books.json');


describe('InvertedIndex class', () => {
  beforeEach(() => {
    this.indexInstance = new InvertedIndex();
    this.validBook = validBook;
    this.wrongFormat = wrongFormat;
    this.emptyFile = emptyFile;
    this.badFile = badFile;
    this.books = books;
  });
  describe('InvertedIndex class', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof this.invertedIndex.createIndex).toBe('function');
    });

    it('should check that the class has a readFile method', () => {
      expect(typeof this.invertedIndex.readFile).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof this.InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a uniqueWords method', () => {
      expect(typeof this.InvertedIndex.uniqueWords).toBe('function');
    });

    it('should check that the class has a tokenizeWords method', () => {
      expect(typeof this.InvertedIndex.tokenizeWords).toBe('function');
    });

    it('should check that the class has a splitAndSort method', () => {
      expect(typeof this.InvertedIndex.splitAndSort).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof this.InvertedIndex.concatenateText).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof this.invertedIndex.searchIndex).toBe('function');
    });
  });

  it('should check that the contents of the uploaded file is valid',
    () => {
      expect(this.invertedIndex.validateFile(validBook)).toBeTruthy();
    });

  it('should return false for empty json files', () => {
    expect(this.invertedIndex.validateFile(emptyFile)).toBeFalsy();
  });

  it('should return true for uploaded files with property "title" and "text" ', () => {
    expect(this.invertedIndex.validateFile(validBook)).toBeTruthy();
  });

  it('should return false for files without "title" and "text" properties',
     () => {
       expect(this.invertedIndexx.validateFile(wrongFormat)).toBeFalsy();
     });

  it('should return false if file is not an array of JSON object',
     () => {
       expect(InvertedIndex.validateFile(wrongFormat)).toBeFalsy();
     });

  it('should return false if file contains an empty array',
     () => {
       expect(InvertedIndex.validateFile(badFile)).toBeFalsy();
     });

  describe('Create Index', () => {
    it('should return mapped indices to words in a JSON file', () => {
      const expectedResult =
        { 'smallValidBook.json':
        { a: [0],
          alice: [0],
          falls: [0],
          hole: [0],
          in: [0],
          into: [0],
          rabbit: [0],
          wonderland: [0],
          alliance: [1, 2],
          an: [1, 2],
          lord: [1, 2],
          man: [1, 2],
          of: [1, 2],
          rings: [1, 2],
          the: [1, 2],
          unusual: [1, 2] } };
      expect(invertedIndex.createIndex(books, 'smallValidBook.json')).toEqual(expectedResult);
    });
  });

  describe('Tokenize words', () => {
    it('should strip out special characters from excerpt in documents', () => {
      let excerpt = 'Alice loves her ima&&gination';
      const expectedTokens = 'Alice loves her imagination';
      excerpt = InvertedIndex.tokenizeWords(excerpt);
      expect(expectedTokens).toEqual(excerpt);
    });
  });


  describe('Get Index', () => {
    it('should verify that index has been created', () => {
      expect(Object.keys(invertedIndex.getIndex('smallValidBook.json')).length)
        .toBeGreaterThan(0);
    });
  });

  describe('Search index', () => {
    it('should return true if search term is a string', () => {
      const term = 'Wonderland of rings';
      expect(Object.keys(invertedIndex.searchIndex(term, 'smallValidBook.json')))
      .toBeTruthy();
    });
  });

  it('should search through single files that are indexed', () => {
    const requiredOutput = {
      'smallValidBook.json':
      {
        alice: [0],
        and: [],
        her: [],
        imagination: [],
        unusual: [1, 2]
      }
    };
    let searchTerm = {};
    searchTerm = invertedIndex.searchIndex('Alice, and her unusual imagination',
      'smallValidBook.json');
    expect(Object.keys(searchTerm)).toEqual(Object.keys(requiredOutput['smallValidBook.json']));
    expect(searchTerm).toEqual(requiredOutput['smallValidBook.json']);
  });
});
