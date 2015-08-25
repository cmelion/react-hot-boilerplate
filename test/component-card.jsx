// import helpers
import should from './helpers';
import proxyquire from 'proxyquire';

describe('card component suite', function() {

    var renderedComponent, React, TestUtils, Component,
        defaultProps, stub;

    proxyquire.noCallThru();

    // Stub context and components before we get started
    before(function() {

        React = this.React;
        TestUtils = this.TestUtils;
        stub = this.sinon.stub;

        defaultProps = {
            id: 1,
            text: 'Write a cool JS library',
            moveCard: this.sinon.spy()
        };

        Component = proxyquire('../src/components/hello-world/sortable-simple/Card.js',
            {
                './simple-subcomponent/': this.stubComponent('simple-subcomponent', true)
            }
        );

        let DNDContext = this.wrapInTestDNDContext(Component, React, defaultProps);

        // render
        renderedComponent = TestUtils.renderIntoDocument(
            <DNDContext />,
            this.container
        );

        this.OriginalComponent = Component;
    });

    it('Should render', function() {
        const cards = TestUtils.scryRenderedComponentsWithType(renderedComponent, this.OriginalComponent);
        should(cards.length).equal(1);

        // check if link and name are correct
        const divs = TestUtils.scryRenderedDOMComponentsWithTag(renderedComponent, 'div');
        should(divs.length > 0).equal(true);

        const subcomponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'simple-subcomponent');
        should(subcomponent.props.className).equal('simple-subcomponent');
    });


    describe('subcomponents', function() {
        //require('./simple-subcomponent.jsx');
    });
});
