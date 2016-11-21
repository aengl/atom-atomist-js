'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';

export class AtomistArgsComponent {

  constructor() {
    etch.initialize(this);
  }

  update(props) {
    this.props = props;
    return etch.update(this);
  }

  render() {
    return (
      <div className='args'>
        <atom-text-editor ref='input' onkeydown={this.onKeyDown.bind(this)} attributes={{
            mini: true,
            tabindex: 1,
            'placeholder-text': 'Editor arguments'
          }}></atom-text-editor>
      </div>
    );
  }

  getElement() {
    return this.element;
  }

  focus() {
    this.refs.input.focus();
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      let args = this.refs.input.getModel().getText().split(' ');
      this.props.success(args);
    } else if (event.key === 'Escape') {
      this.props.cancel();
    }
  }
}
