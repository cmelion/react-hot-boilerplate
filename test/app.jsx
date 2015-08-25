/* global describe, it */
// import helpers
import should from './helpers';

// import page
import App from '../src/App.js';

describe('App suite', function() {
    it('Should render', function() {
        const React = this.React;
        const TestUtils = this.TestUtils;

        // render
        const app = TestUtils.renderIntoDocument(
            <App />,
            this.container
        );

        // check if link and name are correct
        const h1s = TestUtils.scryRenderedDOMComponentsWithTag(app, 'h1');
        should(h1s.length).equal(1);
    });

    describe('Components', function() {
        require('./component-non-dnd-component.jsx');
        require('./component-card.jsx');
    });
});