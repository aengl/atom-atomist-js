'use babel';

import _ from 'lodash';
import { VirtualNodeProject } from 'js-transformabit-demos/dist/NodeProject';
import * as editors from 'js-transformabit-demos/dist/Editors';

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
        ['transformabit:' + editorName]: () => this.runEditor(editors[editorName])
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
    // Create virtual project
    const project = VirtualNodeProject.fromExistingApp('.');
    // Run editor
    this.log('Running editor', editor.name);
    new editor().edit(project, args);
    // Apply results
    project.files().forEach(file => {
      if (file.wasModified()) {
        atom.workspace.open(file.path(), {
          activatePane: true,
          activateItem: true,
          searchAllPanes: true
        }).then(editor => {
          this.log('Editing file ' + editor.getPath());
          editor.setText(file.content());
        });
      }
    });
  }
};
