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

describe('Non-DND component suite', function() {
    var Component, React, TestUtils;

    proxyquire.noCallThru();

    //Stub context and components before we get started
    before(function() {
        React = this.React;
        TestUtils = this.TestUtils;
        this.stubContext(this.Stub);
        Component = proxyquire('../src/components/hello-world/non-dnd-component/',
            {
                './simple-subcomponent/': this.Stub
            }
        );
        this.OriginalComponent = Component;
    });

    it('Should render', function() {

        let defaultProps = {

        };
        let ComponentWithProps = this.wrapInTestContext(Component, React, defaultProps );
        // render
        const comp = TestUtils.renderIntoDocument(
            <ComponentWithProps />,
            this.container
        );

        const divs = TestUtils.scryRenderedDOMComponentsWithTag(comp, 'div');
        should(divs.length).equal(3);

    });



    describe('subcomponents', function() {
        //require('./component-review-item.jsx');
    });
});
