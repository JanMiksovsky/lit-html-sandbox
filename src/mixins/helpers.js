export function existingStyleProps(element) {
  const styleProps = {};
  [...element.style].forEach(key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}


export function formatStyleProps(styleProps) {
  if (!styleProps) {
    return '';
  }
  const attributes = Object.keys(styleProps).map(key => `${key}: ${styleProps[key]}`);
  return attributes.join(';');
}


export function isAttribute(key) {
  const attributeWhiteList = [
    'class',
    'role',
    'style' // for IE 11
  ];
  return key.match(/-/) || attributeWhiteList.indexOf(key) >= 0;
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
    const value = key === 'style' ?
      formatStyleProps(props[key]) :
      props[key];
    if (isAttribute(key) && element.getAttribute(key) !== value) {
      // Update attribute
      if (value) {
        element.setAttribute(key, value);
      } else {
        element.removeAttribute(key);
      }
    } else if (element[key] !== value) {
      // Update property
      element[key] = value;
    }
  });
}
