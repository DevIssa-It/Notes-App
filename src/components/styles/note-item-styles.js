export const noteItemStyles = `:host {
      display: block;
      width: 100%;
      transition: all 300ms ease;
    }
    
    /* Use CSS variables from parent document */
    
    .note-card{
      box-sizing:border-box;
      background: linear-gradient(135deg, var(--card-gradient), var(--input-bg));
      padding:22px;
      border-radius:18px;
      border:2px solid var(--card-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
      height:300px;
      display:flex;
      flex-direction:column;
      gap:14px;
      transition:transform 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms ease, background 300ms ease;
      position:relative;
      overflow:hidden;
      width:100%;
      cursor:pointer;
      backdrop-filter: blur(10px);
    }
    .note-card.selected {
      border-color: var(--accent);
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), var(--card-gradient));
      transform: scale(0.98);
    }
    .select-checkbox {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 200ms ease;
      z-index: 10;
    }
    :host([selection-mode]) .select-checkbox,
    .note-card.selected .select-checkbox {
      opacity: 1;
    }
    .select-checkbox input {
      display: none;
    }
    .checkmark {
      display: block;
      width: 24px;
      height: 24px;
      border: 2px solid var(--accent);
      border-radius: 6px;
      background: var(--card);
      position: relative;
      transition: all 200ms ease;
    }
    .select-checkbox:hover .checkmark {
      transform: scale(1.1);
      border-color: var(--accent-2);
    }
    .select-checkbox input:checked ~ .checkmark {
      background: var(--accent);
      border-color: var(--accent);
    }
    .checkmark::after {
      content: '';
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 6px;
      height: 11px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .select-checkbox input:checked ~ .checkmark::after {
      display: block;
    }
    .note-card.pinned {
      border-color: #f59e0b;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), var(--card-gradient));
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .note-card::before{
      content:'';
      position:absolute;
      top:0;
      left:0;
      right:0;
      height:5px;
      background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981);
      opacity:0;
      transition:opacity 300ms ease;
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    }
    .note-card.pinned::before{
      background:linear-gradient(90deg,#f59e0b,#eab308,#fbbf24);
      opacity:1;
    }
    .note-card::after{
      content:'';
      position:absolute;
      bottom:0;
      right:0;
      width:150px;
      height:150px;
      background:radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%);
      opacity:0;
      transition:opacity 300ms ease;
      pointer-events:none;
    }
    .note-card:hover{
      transform:translateY(-6px) scale(1.02);
      box-shadow: 0 12px 32px rgba(124, 58, 237, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color:rgba(124,58,237,0.5);
    }
    .note-card:hover::before{
      opacity:1;
    }
    .note-card:hover::after{
      opacity:1;
    }
    
    /* Quick Preview Tooltip */
    .note-card::before {
      content: attr(data-preview);
      position: absolute;
      bottom: -60px;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
      color: #e6eef8;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      white-space: nowrap;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(124, 58, 237, 0.3);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      z-index: 100;
    }
    
    .note-card:hover::before {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      bottom: -70px;
    }
    
    .title{
      font-weight:700;
      font-size:1.1rem;
      color: var(--text-primary);
      letter-spacing:0.01em;
      word-wrap:break-word;
      overflow-wrap:break-word;
      line-height:1.4;
      position:relative;
      padding-bottom:8px;
      margin-bottom:4px;
    }
    .title::after{
      content:'';
      position:absolute;
      bottom:0;
      left:0;
      width:40px;
      height:3px;
      background:linear-gradient(90deg, var(--accent), var(--accent-2));
      border-radius:2px;
      transition:width 300ms ease;
    }
    .note-card:hover .title::after{
      width:80px;
    }
    .body{
      white-space:pre-wrap;
      font-size:0.92rem;
      color: var(--text-secondary);
      flex:1;
      line-height:1.6;
      word-wrap:break-word;
      overflow-wrap:break-word;
      overflow-y:auto;
      scrollbar-width:thin;
      scrollbar-color: rgba(124, 58, 237, 0.3) transparent;
      padding-right:4px;
    }
    .body::-webkit-scrollbar{
      width:6px;
    }
    .body::-webkit-scrollbar-track{
      background:transparent;
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb{
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb:hover{
      background: linear-gradient(180deg, var(--accent-2), var(--accent));
    }
    .meta{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top:auto;
      gap:8px;
      padding-top:12px;
      border-top:1px solid rgba(124, 58, 237, 0.08);
      flex-wrap:wrap;
    }
    .created{
      font-size:0.75rem;
      color: var(--muted);
      white-space:nowrap;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.08));
      padding: 5px 10px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid rgba(124, 58, 237, 0.1);
      flex-shrink:0;
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .created::before{
      content: 'ðŸ•';
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .btns{
      display:flex;
      gap:6px;
      align-items:center;
      position:relative;
      flex-shrink:0;
    }
    .quick-actions{
      display:flex;
      gap:4px;
      align-items:center;
    }
    .btn{
      background: linear-gradient(135deg, var(--input-bg), var(--input-bg-focus));
      border:2px solid var(--card-border);
      color: var(--text-primary);
      padding:8px 14px;
      border-radius:10px;
      cursor:pointer;
      font-size:0.85rem;
      font-weight:600;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      position:relative;
      overflow:hidden;
      white-space:nowrap;
      display:inline-flex;
      align-items:center;
      gap:6px;
      flex-shrink:0;
    }
    .btn i{
      font-size:0.8rem;
    }
    .btn-text{
      font-size:0.82rem;
    }
    .btn::before{
      content:'';
      position:absolute;
      top:50%;
      left:50%;
      width:0;
      height:0;
      border-radius:50%;
      background:rgba(124, 58, 237, 0.1);
      transform:translate(-50%, -50%);
      transition:width 400ms ease, height 400ms ease;
    }
    .btn:hover::before{
      width:300px;
      height:300px;
    }
    .btn:hover{
      transform:translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .copyBtn{
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
      border-color: rgba(6, 182, 212, 0.3);
      color: #0891b2;
    }
    .copyBtn:hover{
      background:linear-gradient(135deg, #06b6d4, #0891b2);
      border-color:transparent;
      color:white;
      box-shadow:0 4px 16px rgba(6, 182, 212, 0.4);
    }
    .copyBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .archiveBtn{
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.05));
      border-color: rgba(124, 58, 237, 0.3);
      color: var(--accent);
    }
    .archiveBtn:hover{
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
    }
    .archiveBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .deleteBtn{
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05));
      border-color: rgba(220, 38, 38, 0.3);
      color: #dc2626;
    }
    .deleteBtn:hover{
      background:linear-gradient(135deg, #dc2626, #ef4444);
      border-color:transparent;
      color:white;
      box-shadow:0 4px 16px rgba(220, 38, 38, 0.4);
    }
    .deleteBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .pinBtn{
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
      color: #f59e0b;
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .pinBtn i,
    .favoriteBtn i,
    .moreBtn i{
      display:none;
    }
    .btn-emoji{
      font-size:1rem;
      pointer-events:none;
      line-height:1;
    }
    .pinBtn::after{
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .pinBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .pinBtn:hover::after,
    .pinBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .pinBtn:hover{
      background:rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
      color:#f59e0b;
      transform:scale(1.1);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }
    .pinBtn.pinned{
      color:#f59e0b;
      background:rgba(245, 158, 11, 0.2);
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }
    .pinBtn.pinned::after{
      content: 'Unpin note';
    }
    .favoriteBtn{
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .favoriteBtn::after{
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .favoriteBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .favoriteBtn:hover::after,
    .favoriteBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .favoriteBtn:hover{
      background:rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
      color:#ef4444;
      transform:scale(1.1);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
    .favoriteBtn.favorited{
      color:#ef4444;
      background:rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .favoriteBtn.favorited::after{
      content: 'Remove from favorites';
    }
    .moreBtn{
      background: var(--input-bg);
      border: 1px solid var(--card-border);
      color: var(--text-secondary);
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .moreBtn::after{
      content: 'More actions';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .moreBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .moreBtn:hover::after,
    .moreBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .moreBtn:hover{
      background:var(--accent);
      border-color: var(--accent);
      color:#fff;
      transform:rotate(90deg);
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    }
    .dropdown-menu{
      position:absolute;
      bottom:36px;
      right:0;
      background:var(--card);
      border:2px solid var(--card-border);
      border-radius:12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      padding:6px;
      min-width:140px;
      max-width:180px;
      opacity:0;
      visibility:hidden;
      transform:translateY(10px) scale(0.95);
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      z-index:1000;
      backdrop-filter:blur(10px);
    }
    .dropdown-menu.show{
      opacity:1;
      visibility:visible;
      transform:translateY(0) scale(1);
    }
    .dropdown-item{
      background:transparent;
      border:none;
      color:var(--text-primary);
      padding:8px 12px;
      border-radius:8px;
      cursor:pointer;
      font-size:0.85rem;
      font-weight:500;
      transition:all 200ms ease;
      display:flex;
      align-items:center;
      gap:8px;
      width:100%;
      text-align:left;
    }
    .dropdown-item i{
      display:none;
    }
    .item-emoji{
      font-size:1rem;
      width:18px;
      text-align:center;
      flex-shrink:0;
      line-height:1;
    }
    .dropdown-item:hover{
      background:var(--input-bg);
    }
    .dropdown-item.copy:hover{
      background:rgba(6, 182, 212, 0.1);
      color:#06b6d4;
    }
    .dropdown-item.archive:hover{
      background:rgba(124, 58, 237, 0.1);
      color:var(--accent);
    }
    .dropdown-item.delete:hover{
      background:rgba(220, 38, 38, 0.1);
      color:#dc2626;
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      .btn-text{
        display:none;
      }
      .btn{
        padding:8px 10px;
        gap:0;
      }
      .btn i{
        font-size:0.9rem;
      }
      .btns{
        gap:4px;
      }
    }
    
    .archived{opacity:0.6}`;
