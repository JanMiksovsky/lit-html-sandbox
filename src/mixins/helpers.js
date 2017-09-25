export function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join(';');
}


export function mergeDeep(...sources) {
  const output = {};
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        const value = source[key];
        const valueIsObject = typeof value === 'object' && !Array.isArray(value);
        output[key] = valueIsObject && key in output ?
          mergeDeep(output[key], value) :
          value;
      });
    }
  })
  return output;
}


export function updateProps(element, props) {
  Object.keys(props).forEach(key => {
    const isAttribute = key.match(/-/);
    const value = key === 'style' ?
      formatStyleProps(props[key]) :
      props[key];
    if (isAttribute && element.getAttribute(key) !== value) {
      // Update attribute
      element.setAttribute(key, value);
    } else if (element[key] !== value) {
      // Update property
      element[key] = value;
    }
  });
}
