import * as generatePassword from 'generate-password';

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const compareNormalizedString = (a: string, b: string) =>
  normalizeString(a) > normalizeString(b) ? 1 :
  normalizeString(a) < normalizeString(b)? -1 :
                                            0 ;

export const calculateSearchVector = (fields: string[]): string => {
  const combinedFields = fields.join(' ');
  const normalizedText = normalizeString(combinedFields);
  const uniqueWords = new Set(normalizedText.split(/\s+/));
  return Array.from(uniqueWords).join(' ');
};

export const generateSecurePassword = (): string => {
  return generatePassword.generate({
    length: 8,
    numbers: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
    strict: true
  })
}
