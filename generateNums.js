
export async function generateNums() {
    let nums = [];
    for (let i = 0; i < 3; i++) {
      let n = -1;
      do {
        n = Math.floor(Math.random() * 10);
      } while (nums.includes(n));
      nums.push(n);
    }
    let num = String(100 * nums[0] + 10 * nums[1] + nums[2]);
    return nums;
  }