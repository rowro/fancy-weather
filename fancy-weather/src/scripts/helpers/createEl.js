/**
 * Create DOM element
 * @param {string} tag - default: 'div'
 * @param {string} className
 * @param {string} content - element content
 * @param {HTMLElement} appendTo - parent block
 * @returns {HTMLElement}
 */
export function createEl({
  tag = 'div', className = '', content = '', appendTo = null, elements = [],
}) {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
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
    const className = `${blockClass}__${elName} ${config.className}`;
    return createEl({ ...config, className });
  };
}
