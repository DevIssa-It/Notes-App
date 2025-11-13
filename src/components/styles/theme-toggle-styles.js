export const themeToggleStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :host {
    display: inline-block;
  }

  .theme-toggle {
    position: relative;
    width: 60px;
    height: 30px;
    background: rgba(100, 116, 139, 0.3);
    border-radius: 15px;
    cursor: pointer;
    transition: background 0.3s ease;
    border: 2px solid #334155;
  }

  .theme-toggle:hover {
    background: rgba(100, 116, 139, 0.5);
  }

  .theme-toggle.light {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border-color: #f59e0b;
  }

  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .theme-toggle.light .toggle-slider {
    transform: translateX(30px);
    background: #fef3c7;
  }

  .icon {
    font-size: 0.75rem;
    transition: opacity 0.2s ease;
  }

  .icon-moon {
    color: #7c3aed;
  }

  .icon-sun {
    color: #f59e0b;
  }

  .theme-toggle:not(.light) .icon-sun,
  .theme-toggle.light .icon-moon {
    display: none;
  }
`;
