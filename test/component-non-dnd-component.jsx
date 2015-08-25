/* global describe, it */

// import helpers
import should from './helpers';
import proxyquire from 'proxyquire';

// import component
//import Component from '../src/components/hello-world/non-dnd-component/';

describe('Non-DND component suite', function() {

    it('Should render', function() {
        const React = this.React;
        const TestUtils = this.TestUtils;

        const Component = proxyquire('../src/components/hello-world/non-dnd-component/',
            {
                './simple-subcomponent/': this.stubComponent('simple-subcomponent', true)
            }
        );

        // render
        const comp = TestUtils.renderIntoDocument(
            <Component />,
            this.container
        );

        const headings = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'h1');
        should(headings.length).equal(1);

        const divs = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'div');
        should(divs.length).equal(2);

        let subComponent = TestUtils.findRenderedDOMComponentWithClass(comp, 'simple-subcomponent');
        should(subComponent.props.className).equal('simple-subcomponent');

    });




    describe('subcomponents', function() {
        //require('./component-review-item.jsx');
    });
});
