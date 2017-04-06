[![Coverage Status](https://coveralls.io/repos/github/andela-aonifade/invertedindex/badge.svg?branch=master)](https://coveralls.io/github/andela-aonifade/invertedindex?branch=master)
[![Code Climate](https://codeclimate.com/github/andela-aonifade/dplex/badges/gpa.svg)](https://codeclimate.com/github/andela-aonifade/dplex)
[![Build Status](https://travis-ci.org/andela-aonifade/dplex.svg?branch=development)](https://travis-ci.org/andela-aonifade/dplex?branch=development)

# DPlex - Inverted Index
Inverted Index is concept used to do a reverse search.

## Features of the application
- Allow upload of json files of the format below
```
[
    {
        "title": "This is a sample title",
        "text": "And this is a sample text"
    }
]
```
- Indexing of uploaded files
- Searching of each indexed files and all indexed files

## How to use
The application can be accessed on heroku via [https://dplex-staging.herokuapp.com](https://dplex-staging.herokuapp.com).
It can also be used locally by following the steps below

1.  Clone the repository `git clone https://github.com/andela-aonifade/invertedindex.git`
2.  Move into the repository directory `cd invertedindex`
3.  Run `npm install` to install all the dependencies. The application is build on [Nodejs](nodejs.org) `npm install`

    ### Dependencies
    - gulp
    - coveralls (test coverage reporting)
    - karma (test)
    - eslint (code style)
    - jasmine-core
4.  Start the application by executing the command below `npm start` or `gulp`
5.  To run tests, you can run the command below `npm test` or `gulp lint`

## Limitation
- The application can not be distinguished between plural and singular words. It also does not distinguish between the past tense form of a verb. It does not identify synonyms and sees numbers as string

## More information
- [Inverted Index - Wikipedia](https://en.wikipedia.org/wiki/Inverted_index)
- [Inverted Index](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)
