/* global before, beforeEach, afterEach */
import localStorage from 'localStorage';
import {jsdom} from 'jsdom';
import should from 'should';
import sinon from 'sinon';
const TestBackend = require('react-dnd/modules/backends/Test');
const DragDropContext = require('react-dnd').DragDropContext;

// say we're not in webpack environment
// this is required to skip including styles
global.__WEBPACK__ = false; // eslint-disable-line no-underscore-dangle

// init jsdom
global.document = jsdom();
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

// local storage polyfill
global.window.localStorage = localStorage;
global.localStorage = localStorage;

// import react after dom
const React = require('react/addons');

var stubContext, TestHandler, Router, dndSetup, dndTeardown, getSourceId;

dndSetup = function(root, {isDragging = true} = {}) {

    const manager = root.getManager();
    const monitor = manager.monitor;
    const backend = manager.getBackend();
    const stub = sinon.stub;

    stub(monitor, "isDragging", function () {
        return isDragging;
    });
    stub(monitor, "getTargetIds", function () {
        var handlers = this.registry.handlers;
        for (var property in handlers) {
            if (handlers.hasOwnProperty(property)) {
                return [property];
            }
        }
    });
    stub(monitor, "canDropOnTarget", function () { return true; });
    stub(monitor, "didDrop", function () { return false; });
    stub(monitor, "getItem", function () { return {id: 'bar'}; });
    stub(monitor, "getItemType", function () { return 'product'; });

    return backend;
};

dndTeardown = function(root) {
    const manager = root.getManager();
    const monitor = manager.monitor;

    monitor.isDragging.restore();
    monitor.getTargetIds.restore();
    monitor.canDropOnTarget.restore();
    monitor.didDrop.restore();
    monitor.getItem.restore();
    monitor.getItemType.restore();
};

getSourceId = function(root) {
    const handlers = root.getManager().registry.handlers;
    for (var property in handlers) {
        if (handlers.hasOwnProperty(property)) {
            if (property[0] === 'S') {
                return [property];
            }
        }
    }
};

before(function() {
    // expose react and testutils
    this.React = React;
    this.TestUtils = React.addons.TestUtils;
    this.stubContext = require('react-stub-context');
    this.sinon = sinon;
    this.spyOn = sinon.spy;
    this.dndSetup = dndSetup;
    this.dndTeardown = dndTeardown;
    this.getSourceId = getSourceId;

    //Mock Router
    this.Router = function () {};
    this.Router.makeHref = function() {
        return '';
    };
    this.Router.isActive = function() {
        return false;
    };

    // mock react component
    this.Stub = React.createClass({
        render() {
            return <div className='stub'/>;
        }
    });

    this.Stub['@global'] = true; // this might not be needed in your case, refer to proxyquire docs

    this.stubComponent = function(className, global) {
        // mock react component
        var stub = React.createClass({
            render() {
                return <div className={className || 'stub'}/>;
            }
        });

        if (global) {
            stub['@global'] = true; // this might not be needed in your case, refer to proxyquire docs
        }
        return  stub;
    };

    this.stubStore = function(getInitialState) {
        return Reflux.createStore({
            getInitialState: getInitialState
        });
    };


    /**
     * Wraps a component, passing defaultProps in.
     */
    this.wrapInTestContext = function(DecoratedComponent, React, defaultProps, initialState) {
        return (
            React.createClass({
                getDefaultProps() {
                    return defaultProps;
                },
                getInitialState() {
                    return initialState || {};
                },
                render() {return <DecoratedComponent {...this.props} />}
            })
        );
    };


    /**
     * Wraps a component into a DragDropContext that uses the TestBackend.
     */
    this.wrapInTestDNDContext = function(DecoratedComponent, React, defaultProps) {
        return DragDropContext(TestBackend)(
            React.createClass({
                getDefaultProps() {
                    return defaultProps;
                },

                render() {return <DecoratedComponent {...this.props} />}
            })
        );
    }

});

beforeEach(function() {
    // create container
    this.container = global.window.document.createElement('div');
});

afterEach(function(done) {
    // clean jsdom
    this.React.unmountComponentAtNode(this.container);
    // timeout
    setTimeout(done);
});

export default should;
