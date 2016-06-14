import React from 'react';
import Info from './Info';

// XXX: make stateless/and or use Redux
export default class extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
    this.increaseCount = this.increaseCount.bind(this);
  }
  increaseCount() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    const { count } = this.state;

    return (
      <div>
        <h1>Welcome to Apollo!</h1>
        <button onClick={this.increaseCount}>Click me</button>
        <p>You've pressed the button {count} times.</p>

        <Info />
      </div>
    );
  }
};
