export function getClassName(classList: (string | { [key: string]: boolean })[]) {
  const result = [] as string[];

  classList.forEach((className) => {
    if (className instanceof Object) {
      const entries = Object.entries(className);
      for (let [key, value] of entries) {
        value === true && result.push(key);
      }
    } else {
      result.push(className);
    }
  });

  return result.join(' ');
}
