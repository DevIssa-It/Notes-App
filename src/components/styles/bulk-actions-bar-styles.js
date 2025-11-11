export const bulkActionsBarStyles = `
    :host {
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      animation: slideUp 300ms ease-out;
    }
    
    :host([visible]) {
      display: block;
    }
    
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
    
    .bulk-bar {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      padding: 16px 24px;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 16px;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    
    .count {
      color: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .divider {
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.3);
    }
    
    .actions {
      display: flex;
      gap: 10px;
    }
    
    .action-btn {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 200ms ease;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(5px);
    }
    
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .action-btn.danger {
      background: rgba(220, 38, 38, 0.2);
      border-color: rgba(220, 38, 38, 0.4);
    }
    
    .action-btn.danger:hover {
      background: rgba(220, 38, 38, 0.3);
    }
    
    .action-btn i {
      font-size: 0.9rem;
    }
    
    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 200ms ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
  `;
