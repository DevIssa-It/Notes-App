export const noteEditModalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :host {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  :host([open]) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal {
    position: relative;
    background: var(--card-gradient);
    border-radius: 16px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    border: 2px solid var(--card-border);
    animation: slideUp 0.3s ease;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--card-border);
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .close-button {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .close-button:hover {
    background: rgba(148, 163, 184, 0.1);
    color: var(--text-primary);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.875rem;
    background: var(--input-bg);
    border: 2px solid var(--input-border);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--input-border-focus);
    background: var(--input-bg-focus);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  textarea {
    min-height: 200px;
    resize: vertical;
    line-height: 1.6;
  }

  .char-count {
    text-align: right;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }

  .char-count.warning {
    color: #fb923c;
  }

  .char-count.error {
    color: #ef4444;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  button {
    flex: 1;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-cancel {
    background: rgba(100, 116, 139, 0.2);
    color: #94a3b8;
    border: 1px solid #64748b;
  }

  .btn-cancel:hover {
    background: #64748b;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(100, 116, 139, 0.3);
  }

  .btn-save {
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    color: white;
  }

  .btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(124, 58, 237, 0.4);
  }

  .btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .modal {
      width: 95%;
      padding: 1.5rem;
    }

    .modal-title {
      font-size: 1.25rem;
    }

    .modal-actions {
      flex-direction: column;
    }
  }
`;
