export function generatePassword(
  length: number = 12,
  options: {
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
  } = { uppercase: true, lowercase: true, numbers: true, symbols: true }
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*";

  let validChars = "";
  let password = "";

  if (options.uppercase) validChars += uppercaseChars;
  if (options.lowercase) validChars += lowercaseChars;
  if (options.numbers) validChars += numberChars;
  if (options.symbols) validChars += symbolChars;

  if (!validChars) {
    throw new Error("At least one character type must be selected.");
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    password += validChars[randomIndex];
  }

  return password;
}
