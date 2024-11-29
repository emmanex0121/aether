export function subtractStringsToTwoDecimals(a, b) {
  // Convert the inputs to numbers
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  // Check for valid numbers
  if (isNaN(numA) || isNaN(numB)) {
    throw new Error("Invalid input: both inputs must be valid numbers.");
  }

  // Subtract the numbers and round to 2 decimal places
  const result = Math.round((numA - numB) * 100) / 100;

  // Return the result as a string with 2 decimal places
  return result.toFixed(2);
}
