/* global describe, it */

// import helpers
import should from './helpers';
import proxyquire from 'proxyquire';

// import component
//import Component from '../src/components/hello-world/sortable-simple/Card.js';

describe('Card component suite', function() {

    it('Should render', function() {
        const React = this.React;
        const TestUtils = this.TestUtils;

        const defaultProps = {
            id: 1,
            text: 'Write a cool JS library',
            moveCard: this.sinon.spy()
        };

        const SimpleSubComponent = this.stubComponent('simple-subcomponent', false);

        const Component = proxyquire('../src/components/hello-world/sortable-simple/Card.js',
            {
                './simple-subcomponent/': SimpleSubComponent
            }
        );

        let DNDContext = this.wrapInTestDNDContext(Component, React, defaultProps);

        // render
        const comp = TestUtils.renderIntoDocument(
            <DNDContext />,
            this.container
        );

        console.log(React.findDOMNode(comp).outerHTML);

        const cards = TestUtils.scryRenderedComponentsWithType(comp, Component);
        should(cards.length).equal(1);

    });

    describe('subcomponents', function() {
        //require('./component-review-item.jsx');
    });
});
