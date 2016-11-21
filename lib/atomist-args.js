'use babel';

import _ from 'lodash';

export class AtomistArgsView {

  constructor(props) {
    this.props = props || {};

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('args');

    // Create message element
    const editor = document.createElement('atom-text-editor');
    editor.getModel().setMini(true);
    editor.getModel().setPlaceholderText('Editor arguments');
    editor.addEventListener('keydown', this.onKeyDown.bind(this));
    editor.classList.add('args-input');
    this.element.appendChild(editor);
    this.editor = editor;
  }

  update(props) {
    _.merge(this.props, props);
  }

  getElement() {
    return this.element;
  }

  focus() {
    this.editor.focus();
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      let args = this.editor.getModel().getText().split(' ');
      this.props.success(args);
    } else if (event.key === 'Escape') {
      this.props.cancel();
    }
  }
}
