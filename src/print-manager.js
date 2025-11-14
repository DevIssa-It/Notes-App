/**
 * Print Manager
 * Handle note printing and PDF export
 */

class PrintManager {
  printNote(note) {
    const printWindow = window.open('', '_blank');
    const html = this.generatePrintHTML(note);
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  generatePrintHTML(note) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
            }
            h1 {
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .meta {
              color: #666;
              font-size: 0.9em;
              margin: 20px 0;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="meta">
            Created: ${new Date(note.createdAt).toLocaleString()}
          </div>
          <div class="content">
            ${note.body.replace(/\n/g, '<br>')}
          </div>
        </body>
      </html>
    `;
  }

  printMultiple(notes) {
    const printWindow = window.open('', '_blank');
    const html = this.generateMultipleNotesHTML(notes);
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  generateMultipleNotesHTML(notes) {
    const notesHTML = notes.map((note) => `
      <div class="note">
        <h2>${note.title}</h2>
        <div class="meta">
          Created: ${new Date(note.createdAt).toLocaleString()}
        </div>
        <div class="content">
          ${note.body.replace(/\n/g, '<br>')}
        </div>
      </div>
      <hr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notes Collection</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            .note {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            h2 {
              border-bottom: 1px solid #ccc;
              padding-bottom: 8px;
            }
            .meta {
              color: #666;
              font-size: 0.85em;
              margin: 10px 0;
            }
            hr {
              border: none;
              border-top: 2px dashed #ccc;
              margin: 40px 0;
            }
          </style>
        </head>
        <body>
          ${notesHTML}
        </body>
      </html>
    `;
  }
}

export default new PrintManager();
