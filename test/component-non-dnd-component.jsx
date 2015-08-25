/*
 Copyright (c) 2015 Home Box Office, Inc. as an unpublished
 work. Neither this material nor any portion hereof may be copied
 or distributed without the express written consent of Home Box Office, Inc. *
 This material also contains proprietary and confidential information
 of Home Box Office, Inc. and its suppliers, and may not be used by or
 disclosed to any person, in whole or in part, without the prior written
 consent of Home Box Office, Inc.
 */
/* global describe, it */

// import helpers
import should from './helpers';
import proxyquire from 'proxyquire';

// import component
import Component from '../src/components/hello-world/non-dnd-component/';

describe('Non-DND component suite', function() {

    it.only('Should render', function() {
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

        console.log(React.findDOMNode(comp).outerHTML);
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
