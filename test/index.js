const { expect } = require('chai');

const { modelToArray } = require('./../lib');

const path = require('path');

describe('My package', function () {
  it('should return an array with 4 elements', function () {
    const arr = modelToArray(path.join(__dirname, 'test.model.ts'));
    expect(arr.lenght).to.equals(4);
  });
});
