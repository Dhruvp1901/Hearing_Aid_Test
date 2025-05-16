import assert from 'assert';
import { generateNums } from './generateNums.js';

describe('generateNums function', () => {
  it('should generate 3 unique random digits between 0 and 9', async () => {
    const nums = await generateNums();
    assert(nums.length == 3, 'The result should have exactly 3 numbers.');
    assert(nums[0] !== nums[1] && nums[0] !== nums[2] && nums[1] !== nums[2], 'Numbers should be unique.');
    assert(nums[0] >= 0 && nums[0] <= 9, 'First number should be between 0 and 9.');
    assert(nums[1] >= 0 && nums[1] <= 9, 'Second number should be between 0 and 9.');
    assert(nums[2] >= 0 && nums[2] <= 9, 'Third number should be between 0 and 9.');
  });
});
