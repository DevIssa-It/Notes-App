/**
 * Utility to load CSS for Web Components
 * @param {string} cssPath - Path to CSS file relative to components directory
 * @returns {Promise<string>} CSS content as string
 */
export async function loadCSS(cssPath) {
  try {
    const response = await fetch(`/src/components/styles/${cssPath}`);
    if (!response.ok) {
      throw new Error(`Failed to load CSS: ${cssPath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('CSS loading error:', error);
    return '';
  }
}

/**
 * Create a style element with CSS content
 * @param {string} css - CSS content
 * @returns {HTMLStyleElement}
 */
export function createStyleElement(css) {
  const style = document.createElement('style');
  style.textContent = css;
  return style;
}

/**
 * Load CSS and create style element
 * @param {string} cssPath - Path to CSS file
 * @returns {Promise<HTMLStyleElement>}
 */
export async function loadStyleElement(cssPath) {
  const css = await loadCSS(cssPath);
  return createStyleElement(css);
}
