'use babel';
/* eslint-env jasmine */

import * as path from 'path';

const badPath = path.join(__dirname, 'files', 'bad.php');
const goodPath = path.join(__dirname, 'files', 'good.php');
const emptyPath = path.join(__dirname, 'files', 'empty.php');
const fatalPath = path.join(__dirname, 'files', 'fatal.php');

describe('The php -l provider for Linter', () => {
  const lint = require('../lib/main').provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-php');
      return atom.packages.activatePackage('language-php').then(() =>
        atom.workspace.open(badPath)
      );
    });
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
        atom.workspace.open(badPath).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies that message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('syntax error, unexpected \'{\'');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toEqual(badPath);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 0], [1, 6]]);
        })
      );
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() =>
      atom.workspace.open(emptyPath).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      )
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() =>
      atom.workspace.open(goodPath).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      )
    );
  });

  it('handles fatal errors', () => {
    waitsForPromise(() =>
      atom.workspace.open(fatalPath).then(editor =>
        lint(editor).then(messages => {
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toEqual('Cannot redeclare Test\\A::foo()');
          expect(messages[0].filePath).toBe(fatalPath);
          expect(messages[0].range).toEqual([[10, 4], [10, 25]]);
        })
      )
    );
  });
});
