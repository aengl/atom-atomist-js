'use babel';

import { default as _ } from 'lodash';
import { CompositeDisposable, File } from 'atom';
import { js, css, react, Context } from 'atomist-js';

export default {

  subscriptions: null,
  editors: [],

  activate(state) {
    // Prepare editors
    this.editors = react.editors;
    this.editors.forEach(editor => editor.name = editor.action.name);
    // Register editors
    this.subscriptions = new CompositeDisposable();
    this.editors.forEach(editor =>
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        ['atomist:' + editor.name]: () => this.runEditor(editor, [])
      }))
    );
    this.log('Atomist plugin ready!');
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  log(text) {
    console.log(text);
    atom.notifications.addSuccess(text);
  },

  logError(text) {
    console.error(text);
    atom.notifications.addError(text);
  },

  runEditor(editor, args) {
    let atomEditor = atom.workspace.getActiveTextEditor();
    console.assert(editor);
    let context = Context.createForEditor(editor);
    context.setFile(atomEditor.getPath(), atomEditor.getText());
    this.log('Running editor', editor.name);
    context.runEditor(editor, args);
    for (let file of context.getFiles()) {
      let atomFile = new File(file.path, false);
      this.log('Editing file ' + atomFile.getPath());
      atomFile.write(context.printFile(file));
    }
  }
};
