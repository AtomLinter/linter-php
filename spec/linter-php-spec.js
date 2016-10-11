'use babel';

import * as path from 'path';

const badPath = path.join(__dirname, 'files', 'bad.php');
const goodPath = path.join(__dirname, 'files', 'good.php');
const emptyPath = path.join(__dirname, 'files', 'empty.php');
const fatalPath = path.join(__dirname, 'files', 'fatal.php');

const lint = require('../lib/main.js').provideLinter().lint;

describe('The php -l provider for Linter', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() =>
      Promise.all([
        atom.packages.activatePackage('linter-php'),
        atom.packages.activatePackage('language-php'),
      ]).then(() =>
        atom.workspace.open(badPath)
      )
    );
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-php')).toBe(true)
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-php')).toBe(true)
  );

  describe('checks bad.php and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badPath).then((openEditor) => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => expect(messages.length).toBe(1))
      );
    });

    it('verifies that message', () => {
      waitsForPromise(() =>
        lint(editor).then((messages) => {
          expect(messages[0].type).toBe('Error');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].text).toBe('syntax error, unexpected \'{\'');
          expect(messages[0].filePath).toBe(badPath);
          expect(messages[0].range).toEqual([[1, 0], [1, 6]]);
        })
      );
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() =>
      atom.workspace.open(emptyPath).then(editor =>
        lint(editor).then(messages => expect(messages.length).toBe(0))
      )
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() =>
      atom.workspace.open(goodPath).then(editor =>
        lint(editor).then(messages => expect(messages.length).toBe(0))
      )
    );
  });

  it('handles fatal errors', () => {
    waitsForPromise(() =>
      atom.workspace.open(fatalPath).then(editor =>
        lint(editor).then((messages) => {
          expect(messages[0].type).toBe('Error');
          expect(messages[0].text).toBe('Cannot redeclare Test\\A::foo()');
          expect(messages[0].filePath).toBe(fatalPath);
          expect(messages[0].range).toEqual([[10, 4], [10, 25]]);
        })
      )
    );
  });
});
