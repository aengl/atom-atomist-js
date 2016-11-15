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
    let ast = atomist.parser.parse(editor.getSelectedText());
    let node = atomist.parser.findFirst(ast, atomist.components.simple.isSimpleComponent);
    if (!node) {
      this.logError('No simple component in selected text');
    } else {
      atomist.parser.transform(node, atomist.components.actions.upgradeComponent);
      this.log('Successfully applied upgradeComponent!');
      editor.insertText(atomist.parser.print(ast));
    }
  }
};
