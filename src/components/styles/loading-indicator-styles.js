export const loadingIndicatorStyles = `
  :host {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px);
    transition: all 300ms ease;
  }

  :host([active]) {
    display: flex;
  }

  .loader-container {
    background: var(--card-gradient);
    padding: 40px 50px;
    border-radius: 20px;
    border: 2px solid var(--card-border);
    box-shadow: var(--shadow-lg);
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border: 4px solid rgba(124, 58, 237, 0.2);
    border-top: 4px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .message {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .submessage {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 8px 0 0 0;
  }
`;
