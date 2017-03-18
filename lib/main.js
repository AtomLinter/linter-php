'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import * as helpers from 'atom-linter';
import { dirname } from 'path';

// Local variables
const parseRegex = /^(?:Parse|Fatal) error:\s+(.+) in .+?(?: on line |:)(\d+)/gm;

// Settings
let executablePath;
let errorReporting;

export default {
  activate() {
    require('atom-package-deps').install('linter-php');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-php.executablePath', (value) => {
        executablePath = value;
      }),
    );
    this.subscriptions.add(
      atom.config.observe('linter-php.errorReporting', (value) => {
        errorReporting = value;
      }),
    );
  },

  deactivate() {
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

        const parameters = [
          '--syntax-check',
          '--define', 'display_errors=On',
          '--define', 'log_errors=Off',
        ];
        if (errorReporting) {
          parameters.push('--define', 'error_reporting=E_ALL');
        }

        const execOptions = {
          stdin: fileText,
          ignoreExitCode: true,
        };

        if (filePath !== null) {
          // Only specify a CWD if the file has been saved
          const [projectPath] = atom.project.relativizePath(filePath);
          execOptions.cwd = projectPath !== null ? projectPath : dirname(filePath);
        }

        const output = await helpers.exec(executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update messages
          return null;
        }

        const messages = [];
        let match = parseRegex.exec(output);
        while (match !== null) {
          const line = Number.parseInt(match[2], 10) - 1;
          messages.push({
            type: 'Error',
            filePath,
            range: helpers.generateRange(textEditor, line),
            text: match[1],
          });
          match = parseRegex.exec(output);
        }
        return messages;
      },
    };
  },
};
