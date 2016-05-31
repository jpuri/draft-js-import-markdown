/* @flow */
const {describe, it} = global;
import expect from 'expect';
import stateFromMarkdown from '../stateFromMarkdown';
import {convertToRaw} from 'draft-js';

describe('stateFromMarkdown', () => {
  let markdown = 'Hello World';
  it('should create content state', () => {
    let contentState = stateFromMarkdown(markdown);
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual(
      [{text: 'Hello World', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: []}]
    );
  });

  it('should create bold style', () => {
    let contentState = stateFromMarkdown('This is **bold**');
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual(
      [{text: 'This is bold', type: 'unstyled', depth: 0, inlineStyleRanges: [{length: 4, offset: 8, style: 'BOLD'}], entityRanges: []}]
    );
  });

  it('should create a link block', () => {
    let contentState = stateFromMarkdown('This is a [link](http://example.com)');
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual(
      [{text: 'This is a link', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [{key: 0, offset: 10, length: 4}]}]
    );

    let entityMap = rawContentState.entityMap;
    expect(entityMap['0']).toEqual(
      {data: {url: 'http://example.com'}, mutability: 'MUTABLE', type: 'LINK'}
    );
  });
});

function removeKeys(blocks) {
  return blocks.map((block) => {
    let {key, ...other} = block; // eslint-disable-line no-unused-vars
    return other;
  });
}
