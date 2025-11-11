export const searchBarStyles = `
    :host {
      display: block;
      width: 100%;
      margin-bottom: 24px;
      transition: all 300ms ease;
    }

    /* Use CSS variables from parent document */
    /* Use CSS variables from parent document */

    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 14px 50px 14px 20px;
      background: var(--card-gradient);
      border: 2px solid var(--card-border);
      border-radius: 16px;
      color: var(--text-primary);
      font-size: 1rem;
      font-family: inherit;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-md);
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--input-border-focus);
      background: var(--input-bg-focus);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3), 0 0 0 4px rgba(124, 58, 237, 0.1);
    }

    .search-input::placeholder {
      color: var(--text-secondary);
    }

    /* Hide default browser search clear button */
    .search-input::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
    }

    .search-input::-webkit-search-decoration {
      -webkit-appearance: none;
      appearance: none;
    }

    .search-icon {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      pointer-events: none;
      transition: all 250ms ease;
      opacity: 1;
      visibility: visible;
    }

    .search-icon.hidden {
      opacity: 0;
      visibility: hidden;
    }

    .search-input:focus ~ .search-icon {
      color: #7c3aed;
    }

    .clear-btn {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.4rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 200ms ease;
      opacity: 0;
      visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }

    .clear-btn.visible {
      opacity: 1;
      visibility: visible;
    }

    .clear-btn:hover {
      background: rgba(124, 58, 237, 0.2);
      color: var(--text-primary);
      transform: translateY(-50%) scale(1.1);
    }

    .clear-btn:active {
      transform: translateY(-50%) scale(0.95);
    }

    .search-result {
      text-align: center;
      margin-top: 12px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .search-result.active {
      color: #7c3aed;
      font-weight: 600;
    }
  `;
