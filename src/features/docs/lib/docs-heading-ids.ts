export function createDocHeadingIdGenerator() {
  const counts = new Map<string, number>();

  return (text: string) => {
    const baseId = getDocHeadingBaseId(text);
    const count = counts.get(baseId) ?? 0;
    counts.set(baseId, count + 1);

    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };
}

export function getDocHeadingBaseId(text: string): string {
  const id = text
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return id || 'section';
}
