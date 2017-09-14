'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

// Dependencies
let helpers;
let path;

// Local variables
const parseRegex = /^((?:Parse|Fatal) error|Deprecated):\s+(.+) in .+?(?: on line |:)(\d+)/gm;

const loadDeps = () => {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!path) {
    path = require('path');
  }
};

export default {
  activate() {
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterPhpDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-php');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterPhpDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-php.executablePath', (value) => {
        this.executablePath = value;
      }),
      atom.config.observe('linter-php.errorReporting', (value) => {
        this.errorReporting = value;
      }),
      atom.config.observe('linter-php.ignorePhpIni', (value) => {
        this.ignorePhpIni = value;
      }),
    );
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'PHP',
      grammarScopes: ['text.html.php', 'source.php'],
      scope: 'file',
      lintOnFly: true,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const fileText = textEditor.getText();

        // Ensure that the dependencies are loaded
        loadDeps();

        const parameters = [
          '--syntax-check',
          '--define', 'display_errors=On',
          '--define', 'log_errors=Off',
        ];
        if (this.errorReporting) {
          parameters.push('--define', 'error_reporting=E_ALL');
        }
        if (this.ignorePhpIni) {
          // No configuration (ini) files will be used
          parameters.push('-n');
        }

        const execOptions = {
          stdin: fileText,
          ignoreExitCode: true,
        };

        if (filePath !== null) {
          // Only specify a CWD if the file has been saved
          const [projectPath] = atom.project.relativizePath(filePath);
          execOptions.cwd = projectPath !== null ? projectPath : path.dirname(filePath);
        }

        const output = await helpers.exec(this.executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update messages
          return null;
        }

        const messages = [];
        let match = parseRegex.exec(output);
        while (match !== null) {
          const line = Number.parseInt(match[3], 10) - 1;
		  const errorType = match[1]
          messages.push({
            type: (errorType.match(/error/i) !== null ? 'Error' : 'Warning'),
            filePath,
            range: helpers.generateRange(textEditor, line),
            text: match[2],
          });
          match = parseRegex.exec(output);
        }
        return messages;
      },
    };
  },
};
