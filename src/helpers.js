export function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join(';');
}


export function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  Object.keys(source).forEach(key => {
    const value = source[key];
    const valueIsObject = typeof value === 'object' && !Array.isArray(value);
    output[key] = valueIsObject && key in output ?
      mergeDeep(output[key], value) :
      value;
  });
  return output;
}
