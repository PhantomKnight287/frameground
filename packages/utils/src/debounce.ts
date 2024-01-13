
/**
 * 
 * @param fn The function to debounce
 * @param wait The time to wait before calling the function(in milliseconds)
 */
export function debounce(fn: Function, wait: number) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
