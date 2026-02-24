export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function reorder<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function moveUp<T>(arr: T[], idx: number) {
  if (idx <= 0) return arr;
  return reorder(arr, idx, idx - 1);
}

export function moveDown<T>(arr: T[], idx: number) {
  if (idx >= arr.length - 1) return arr;
  return reorder(arr, idx, idx + 1);
}