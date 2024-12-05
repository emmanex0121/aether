const customToUpperCase = (input) => {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }

  let result = "";
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const charCode = char.charCodeAt(0);

    // Check if character is a lowercase letter (a-z)
    if (charCode >= 97 && charCode <= 122) {
      // Convert to uppercase by subtracting 32 from charCode
      result += String.fromCharCode(charCode - 32);
    } else {
      // If not a lowercase letter, append the character as-is
      result += char;
    }
  }
  return result;
};

export { customToUpperCase };
