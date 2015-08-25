import React from 'react';
import SimpleSubcomponent from './simple-subcomponent/';

export default class NonDndComponent {
  render() {
    return (
      <div>
        <div>Simple Component to demonstrate mocking sub components via Proxyquire</div>
        <SimpleSubcomponent />
      </div>
    );
  }
}