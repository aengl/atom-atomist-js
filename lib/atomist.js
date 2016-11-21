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
        this.modalPanel.hide();
        this.runEditor(editor, args);
      },
      cancel: () => this.modalPanel.hide()
    });
    this.modalPanel.show();
    this.argsView.clear();
    this.argsView.focus();
  },

  runEditor(editor, args) {
    // Create context
    let activeEditor = atom.workspace.getActiveTextEditor();
    console.assert(editor);
    let context = Context.createForEditor(editor);
    context.setFile(activeEditor.getPath(), activeEditor.getText());
    // Run editor
    this.log('Running editor', editor.name);
    console.log('Editor context is', context);
    context.runEditor(editor, args);
    // Apply results
    for (let file of context.getFiles()) {
      atom.workspace.open(file.path, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      }).then(editor => {
        this.log('Editing file ' + editor.getPath());
        editor.setText(context.printFile(file));
      });
    }
  }
};
