'use babel';

import { CompositeDisposable } from 'atom';
import { default as atomist } from 'atomist-js';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atomist:toggle': () => this.toggle(),
      'atomist:upgradeComponent': () => this.upgradeComponent()
    }));

    this.log('Ready!')
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  toggle() {
  },

  log(text) {
    console.log(text);
    atom.notifications.addSuccess(text);
  },

  logError(text) {
    console.error(text);
    atom.notifications.addError(text);
  },

  upgradeComponent() {
    let editor = atom.workspace.getActiveTextEditor();
    let text = editor.getSelectedText();
    let hasSelection = text.length > 0;
    if (!hasSelection) {
      text = editor.getText();
    }
    let ast = atomist.parser.parse(text);
    let nodes = atomist.parser.find(ast, atomist.components.simple.isSimpleComponent);
    if (nodes.length === 0) {
      this.logError('No simple component in selected text');
    } else {
      atomist.parser.transform(nodes[0], atomist.components.actions.upgradeComponent);
      this.log('Successfully applied upgradeComponent!');
      let result = atomist.parser.print(ast);
      if (hasSelection) {
        editor.insertText(result);
      } else {
        editor.setText(result);
      }
    }
  }
};
