export function sumStringsToTwoDecimals(...strings) {
  // Convert the strings to numbers, round to 2 decimal places, and sum them
  const sum = strings.reduce((acc, str) => {
    const num = parseFloat(str);
    if (!isNaN(num)) {
      // Round to 2 decimal places and add to the accumulator
      acc += Math.round(num * 100) / 100;
    }
    return acc;
  }, 0);

  // Return the sum as a string
  return sum.toFixed(2); // This ensures the result has 2 decimal places
}
