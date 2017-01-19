'use babel';

import _ from 'lodash';
import * as editors from 'js-transformabit-demos';
import { CompositeDisposable } from 'atom';
import { ArgsView } from './args-view';

export default {

  subscriptions: null,
  argsView: null,
  modalPanel: null,

  activate() {
    // Register editors
    this.subscriptions = new CompositeDisposable();
    Object.keys(editors).forEach(editorName =>
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        ['transformabit:' + editorName]: () => this.showArgsDialog(editors[editorName])
      }))
    );
    // Prepare UI
    this.argsView = new ArgsView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.argsView.getElement(),
      visible: false
    });
    this.log('Ready!');
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() { },

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
    let context = Context.createForEditor(editor);
    let activeEditor = atom.workspace.getActiveTextEditor();
    if (activeEditor) {
      context.readFile(activeEditor.getPath(), activeEditor.getText());
    }
    // Run editor
    this.log('Running editor', editor.name);
    console.log('Editor context is', context);
    context.runEditor(editor, args);
    // Apply results
    for (let file of context.getFiles()) {
      atom.workspace.open(file.path, {
        activatePane: true,
        activateItem: true,
        searchAllPanes: true
      }).then(editor => {
        this.log('Editing file ' + editor.getPath());
        editor.setText(context.printFile(file));
      });
    }
  }
};
