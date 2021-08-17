import { expect } from 'chai';
import { runner } from '.';

describe('runner test', function () {
  it('Simple test from task', function () {
    const result = runner(
      [
        // prettierignore
        '.X.',
        '.X.',
        '...',
      ],
      2,
      1,
      0,
      2,
    );

    expect(result).to.deep.equal([
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it('Diagonal wall test', function () {
    const result = runner(
      [
        // prettierignore
        '.X....',
        '.X....',
        '..XX..',
        '...XX.',
        '....X.',
        '......',
      ],
      5,
      2,
      1,
      5,
    );

    expect(result).to.deep.equal([
      { x: 5, y: 2 },
      { x: 4, y: 3 },
      { x: 5, y: 4 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
    ]);
  });

  it('Horizontal wall test', function () {
    const result = runner(
      [
        // prettierignore
        '......',
        '......',
        '.XXXX.',
        '......',
        '......',
        '......',
      ],
      4,
      3,
      0,
      3,
    );

    console.log(result);

    expect(result).to.deep.equal([
      { x: 4, y: 3 },
      { x: 3, y: 4 },
      { x: 2, y: 5 },
      { x: 1, y: 4 },
      { x: 0, y: 3 },
    ]);
  });
});
