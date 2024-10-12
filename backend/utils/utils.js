const generatePassword = (length = 12, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialCharacters = true,
  } = options;

  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  let characterSet = "";

  if (includeLowercase) {
    characterSet += lowercaseChars;
  }
  if (includeUppercase) {
    characterSet += uppercaseChars;
  }
  if (includeNumbers) {
    characterSet += numberChars;
  }
  if (includeSpecialCharacters) {
    characterSet += specialChars;
  }

  if (characterSet.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    password += characterSet[randomIndex];
  }

  return password;
};

module.exports = generatePassword;
