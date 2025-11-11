// Shared styles for components
export const sharedCss = `
:host, :host * {
  box-sizing: border-box;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

/* Utility buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.06);
  background: transparent;
  color: var(--text-primary);
}

.visually-hidden {
  position: absolute !important;
  height: 1px; width: 1px;
  overflow: hidden; clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap; border: 0; padding: 0; margin: -1px;
}

/* Small helpers */
.kbd {
  background: rgba(148,163,184,0.08);
  border-radius: 6px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 12px;
}

/* Simple responsive grid for lists */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
`;

// Try to create a constructible stylesheet for modern browsers
const computeSharedSheet = () => {
  try {
    // eslint-disable-next-line no-undef
    const s = new CSSStyleSheet();
    s.replaceSync(sharedCss);
    return s;
  } catch (err) {
    return null;
  }
};

const sharedSheet = computeSharedSheet();
export { sharedSheet };
export default sharedCss;
