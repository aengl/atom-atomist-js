'use babel';

export class ArgsView {

  constructor(props) {
    this.props = props || {};

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('args');

    // Create label element
    let label = document.createElement('div');
    label.classList.add('args-label');
    label.innerHTML = 'Enter a list of <strong>comma-separated</strong> editor arguments or press <strong>Esc</strong> to cancel.';
    this.element.appendChild(label);

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
    Object.assign(this.props, props);
  }

  getElement() {
    return this.element;
  }

  clear() {
    this.editor.getModel().setText('');
  }

  focus() {
    this.editor.focus();
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      let text = this.editor.getModel().getText();
      let args = text.length > 0 ? text.split(',') : [];
      this.props.success(args);
    } else if (event.key === 'Escape') {
      this.props.cancel();
    }
  }
}
