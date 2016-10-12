'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import * as helpers from 'atom-linter';
import { dirname } from 'path';

// Local variables
const parseRegex = /^(?:Parse|Fatal) error:\s+(.+) in .+?(?: on line |:)(\d+)/gm;
const phpCheckCache = new Map();

// Settings
let executablePath;
let errorReporting;

const testBin = async () => {
  if (phpCheckCache.has(executablePath)) {
    return;
  }
  const title = 'linter-php: Unable to determine PHP version';
  const message = `Unable to determine the version of "${executablePath}` +
    '", please verify that this is the right path to PHP. If you believe you ' +
    'have fixed this problem please restart Atom.';

  let output;
  try {
    output = await helpers.exec(executablePath, ['-v']);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    phpCheckCache.set(executablePath, false);
    atom.notifications.addError(title, { detail: message });
  }

  const regex = /PHP (\d+)\.(\d+)\.(\d+)/g;
  if (!regex.exec(output)) {
    phpCheckCache.set(executablePath, false);
    atom.notifications.addError(title, { detail: message });
  }
  phpCheckCache.set(executablePath, true);
};

export default {
  activate() {
    require('atom-package-deps').install('linter-php');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-php.executablePath', (value) => {
        executablePath = value;
        testBin();
      })
    );
    this.subscriptions.add(
      atom.config.observe('linter-php.errorReporting', (value) => {
        errorReporting = value;
      })
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
        if (!phpCheckCache.has(executablePath)) {
          await testBin();
        }
        if (!phpCheckCache.get(executablePath)) {
          // We don't have a valid PHP version, don't update messages
          return null;
        }

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

        const [projectPath] = atom.project.relativizePath(filePath);
        const execOptions = {
          stdin: fileText,
          cwd: projectPath !== null ? projectPath : dirname(filePath),
          ignoreExitCode: true,
        };

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
            range: helpers.rangeFromLineNumber(textEditor, line),
            text: match[1],
          });
          match = parseRegex.exec(output);
        }
        return messages;
      },
    };
  },
};
