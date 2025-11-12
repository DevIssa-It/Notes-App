export const noteDetailStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :host {
    display: block;
    min-height: 100vh;
    background: linear-gradient(180deg, var(--bg), var(--bg-gradient-end));
    color: var(--text-primary);
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.2rem;
    color: var(--text-secondary);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--card-border);
  }

  .back-button {
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .back-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
  }

  .back-button:active {
    transform: translateY(0);
  }

  .note-content {
    background: var(--card-gradient);
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid var(--card-border);
  }

  .note-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .note-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--card-border);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .meta-item i {
    color: #7c3aed;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .status-badge.active {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid #22c55e;
  }

  .status-badge.archived {
    background: rgba(251, 146, 60, 0.2);
    color: #fb923c;
    border: 1px solid #fb923c;
  }

  .note-body {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--card-border);
  }

  .action-button {
    flex: 1;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .archive-button {
    background: rgba(251, 146, 60, 0.2);
    color: #fb923c;
    border: 1px solid #fb923c;
  }

  .archive-button:hover {
    background: #fb923c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(251, 146, 60, 0.3);
  }

  .unarchive-button {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid #22c55e;
  }

  .unarchive-button:hover {
    background: #22c55e;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
  }

  .edit-button {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid #3b82f6;
  }

  .edit-button:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  .delete-button {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
  }

  .delete-button:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
  }

  .action-button:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .note-title {
      font-size: 1.8rem;
    }

    .note-body {
      font-size: 1rem;
    }

    .actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
    }
  }
`;
