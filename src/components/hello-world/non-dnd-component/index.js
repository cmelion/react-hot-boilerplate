import React, { Component } from 'react';
import SimpleSubcomponent from './simple-subcomponent/';

export default class NonDndComponent extends Component {
  render() {
    return (
        <div>
          <h1>Simple Component to demonstrate mocking sub components via Proxyquire</h1>
          <SimpleSubcomponent />
        </div>
    );
  }
}
