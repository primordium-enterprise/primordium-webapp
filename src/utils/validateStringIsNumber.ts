const numberOnlyRegEx = /^[0-9]*\.?[0-9]*$/

export default function validateStringIsNumber(value: string): boolean {
  return numberOnlyRegEx.test(value);
}