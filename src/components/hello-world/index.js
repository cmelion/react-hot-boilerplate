import React, { Component } from 'react';
import SortableSimple from './sortable-simple/';

export default class HelloWorld extends Component {
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <SortableSimple />
            </div>
        );
    }
}
