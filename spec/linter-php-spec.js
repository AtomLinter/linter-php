"use babel";

describe('The php -l provider for Linter', () => {
  const lint = require('../lib/main').provideLinter().lint;

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage("linter-php");
    });
  });

  it('finds a syntax error in bad.php', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/files/bad.php').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('syntax error, unexpected \'{\' in -');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+bad\.php$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 0], [1, 6]]);
        });
      });
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/files/empty.php').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/files/good.php').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
