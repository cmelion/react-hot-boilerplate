/* global describe, it */

import should from './';
import recursive from 'recursive-readdir';
import stream from 'stream';
import fs from 'fs';
import difference from 'lodash/array/difference';
import gitinfo from 'gitinfo';

describe('Tests Exist', function() {
    //TODO:  DRY the tests for file existence up https://youtrack.hbo.com/youtrack/issue/lib-162
    it('Should have a test for each component', function(done) {

        var expectedComponentTests = [],
            actualComponentTests = [];

        //Get expected Component Tests array
        recursive('src/components/', function (err, files) {
            const isJSFile = file => file.endsWith('index.js');
            const componentTestName = file => {
                let pathArray = file.split('/');
                return ('test/component-' + pathArray[pathArray.length - 2] + '.jsx');
            };
            expectedComponentTests = files.filter(isJSFile).map(componentTestName);

            //Get actual Component Tests array
            recursive('test/', ['index.jsx', 'page*.jsx', 'store*.jsx', 'test/helpers/*.*'], function (err, files) {
                actualComponentTests = files;

                //Get missing tests
                let diff = difference(expectedComponentTests, actualComponentTests );
                if (diff.length > 0) {
                    console.warn('Warning:  Missing tests for:');
                    console.error(diff);
                }
                try {
                    should(diff.length).equal(0);
                    done();
                }
                catch (e) {
                    done(e);
                }
            });

        });

    });

    it('Should have a test for each page', function(done) {

        var expectedPageTests = [],
            actualPageTests = [];

        //Get expected Component Tests array
        recursive('src/pages/', function (err, files) {
            const isJSFile = file => file.endsWith('index.js');
            const pageTestName = file => {
                let pathArray = file.split('/');
                return ('test/page-' + pathArray[pathArray.length - 2] + '.jsx');
            };
            expectedPageTests = files.filter(isJSFile).map(pageTestName);

            //Get actual Page Tests array
            recursive('test/', ['index.jsx', 'component*.jsx', 'store*.jsx', 'test/helpers/*.*'], function (err, files) {
                actualPageTests = files;

                //Get missing tests
                let diff = difference(expectedPageTests, actualPageTests );
                if (diff.length > 0) {
                    console.warn('Warning:  Missing tests for:');
                    console.error(diff);
                }
                try {
                    should(diff.length).equal(0);
                    done();
                }
                catch (e) {
                    done(e);
                }
            });

        });

    });

    it('Should have a test for each store', function(done) {

        var expectedStoreTests = [],
            actualStoreTests = [];

        //Get expected Store Tests array
        recursive('src/stores/', function (err, files) {
            const storeTestName = file => {
                let pathArray = file.split('/');
                return ('test/store-' + pathArray[pathArray.length - 1]);
            };
            actualStoreTests = files.map(storeTestName);

            //Get actual Store Tests array
            recursive('test/', ['index.jsx', 'component*.jsx', 'page*.jsx', 'test/helpers/*.*'], function (err, files) {
                expectedStoreTests = files;

                //Warn missing tests
                let diff = difference(actualStoreTests, expectedStoreTests );
                if (diff.length > 0) {
                    console.warn('Warning:  Missing tests for:');
                    console.error(diff);
                }
                try {
                    should(diff.length).equal(0);
                    done();
                }
                catch (e) {
                    done(e);
                }
            });

        });

    });

    it('Should reference all tests', function(done) {

        let requiredPathRegex = /\s*require\(\'([^']+)/;
        let actualTests = [];
        let expectedTests = [];
        let filesToParse = [];
        let filesToParseLength = 0;
        let diff = 0;

        //Remove 'test' from path to compare with require import statement
        const requiredTestName = file => {
            let pathArray = file.split('/');
            return ('./' + pathArray[pathArray.length - 1]);
        };

        //Get a new stream for line-by-line check for test file require statements
        const getLiner = () => {
            var liner = new stream.Transform( { objectMode: true } );

            //If the line matches the REGEX push it's path into the actualTests Array
            liner.on('readable', function() {
                let line;
                while (line = liner.read()) {
                    // do something with line
                    let match = line.match(requiredPathRegex);
                    if (match) {
                        actualTests.push(match[1]);
                    }
                }
            });

            //Wait for stream to be processed before getting the next file
            liner.on('end', function() {
                if (filesToParseLength > 0) {
                    processFile();
                } else {
                    //Get missing test references
                    diff = difference(expectedTests.map(requiredTestName), actualTests);
                    if (diff.length > 0) {
                        console.warn('Warning:  Missing test references for existing tests:');
                        console.error(diff);
                    }
                    try {
                        should(diff.length).equal(0);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                }
            });

            liner._transform = function(chunk, encoding, done) {
                var data = chunk.toString();
                if (this._lastLineData) data = this._lastLineData + data;

                var lines = data.split('\n');
                this._lastLineData = lines.splice(lines.length - 1, 1)[0];

                lines.forEach(this.push.bind(this));
                done();
            };

            liner._flush = function(done) {
                if (this._lastLineData) this.push(this._lastLineData);
                this._lastLineData = null;
                done();
            };

            return liner;
        };

        const processFile = () => {
            filesToParseLength--;
            let source = fs.createReadStream(filesToParse[filesToParseLength]);
            let liner = getLiner();
            source.pipe(liner);
        };

        //Get the expected files to include
        recursive('test/', ['index.jsx', 'test/helpers/*.*'], function (err, files) {
            expectedTests = files;
            //get the actual files that were included
            recursive('test/', [ 'test/helpers/*.*'], function (err, files) {
                filesToParse = files;
                filesToParseLength = filesToParse.length;
                processFile();
            });
        });

    });
});

