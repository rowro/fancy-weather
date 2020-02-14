/**
 * Create DOM element
 * @param {string} tag - default: 'div'
 * @param {string} className
 * @param {string} id
 * @param {object} attr - HTML attributes
 * @param {string} content - element content
 * @param {Array.<HTMLElement>} elements - array of DOM elements
 * @param {HTMLElement} appendTo - parent block
 * @returns {HTMLElement}
 */
export function createEl({
  tag = 'div',
  className = '',
  id = '',
  attr = {},
  content = '',
  appendTo = null,
  elements = [],
}) {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (id) {
    el.id = id;
  }

  if (attr) {
    Object.keys(attr).forEach((key) => {
      el.setAttribute(key, attr[key]);
    });
  }

  if (content) {
    el.innerHTML = content;
  }

  if (elements) {
    elements.forEach((item) => {
      el.append(item);
    });
  }

  if (appendTo) {
    appendTo.append(el);
  }

  return el;
}

/**
 * Create DOM element on base BEM block class name
 * @param {string} blockClass
 * @returns {function(*, *): HTMLElement}
 */
export function createBEMEl(blockClass) {
  return function f(elName, config) {
    let className = `${blockClass}__${elName}`;
    if (config.className) className += ` ${config.className}`;
    return createEl({ ...config, className });
  };
}
