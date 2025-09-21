import type Graphics from '../core/graphics';

export function isWindows() {
  return (
    navigator.platform.toLowerCase().includes('win')
    || navigator.userAgent.includes('Windows')
  );
}
export function getNoConflictObjectName(parent: Graphics, objectType: string) {
  const children = parent.getChildren();
  let maxNum = 0;
  const regexp = new RegExp(`^${objectType}\\s+(\\d+)`);
  for (const child of children) {
    const match = child.attrs.objectName.match(regexp);
    if (match) {
      const num = Number.parseInt(match[1]);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `${objectType} ${maxNum + 1}`;
}
