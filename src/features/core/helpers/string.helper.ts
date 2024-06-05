export function capitalize(word: string | string[]) {
  const target = typeof word == 'object' ? word[0] : word;

  return (
    target.substring(0, 1).toUpperCase() + target.substring(1).toLowerCase()
  );
}
