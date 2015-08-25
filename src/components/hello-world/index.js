import React, { Component } from 'react';
import SortableSimple from './sortable-simple/';
import NonDndComponent from './non-dnd-component/';

export default class HelloWorld extends Component {
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <SortableSimple />
                <NonDndComponent />
            </div>
        );
    }
}
