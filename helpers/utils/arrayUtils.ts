export function insertIf(condition: boolean, ...elements: any[]) {
  return condition ? elements : [];
}
