'use babel';

import _ from 'lodash';
import { CompositeDisposable, File } from 'atom';
import { js, css, react, Context } from 'atomist-js';
import { AtomistArgsView } from './atomist-args';

export default {

  subscriptions: null,
  editors: [],
  argsView: null,
  modalPanel: null,

  activate(state) {
    // Prepare editors
    this.editors = react.editors;
    this.editors.forEach(editor => editor.name = editor.action.name);
    // Register editors
    this.subscriptions = new CompositeDisposable();
    this.editors.forEach(editor =>
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        ['atomist:' + editor.name]: () => this.showArgsDialog(editor)
      }))
    );
    // Prepare UI
    this.argsView = new AtomistArgsView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.argsView.getElement(),
      visible: false
    });
    this.log('Atomist plugin ready!');
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {},

  log(text) {
    console.log(text);
    atom.notifications.addSuccess(text);
  },

  logError(text) {
    console.error(text);
    atom.notifications.addError(text);
  },

  showArgsDialog(editor) {
    this.argsView.update({
      success: args => {
        this.runEditor(editor, args);
        this.modalPanel.hide();
      },
      cancel: () => this.modalPanel.hide()
    });
    this.modalPanel.show();
    this.argsView.focus();
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
