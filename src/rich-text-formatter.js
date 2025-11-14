/**
 * Rich Text Formatter
 * Format and parse rich text content
 */

class RichTextFormatter {
  constructor() {
    this.markdownPatterns = {
      bold: /\*\*(.*?)\*\*/g,
      italic: /\*(.*?)\*/g,
      code: /`(.*?)`/g,
      link: /\[(.*?)\]\((.*?)\)/g,
      heading: /^(#{1,6})\s(.+)$/gm,
      list: /^[-*]\s(.+)$/gm,
      quote: /^>\s(.+)$/gm,
    };
  }

  markdownToHTML(markdown) {
    if (!markdown) return '';
    
    let html = markdown;

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Lists
    html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  htmlToMarkdown(html) {
    if (!html) return '';
    
    let markdown = html;

    // Headings
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');

    // Bold
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');

    // Italic
    markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');

    // Code
    markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');

    // Links
    markdown = markdown.replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, '[$2]($1)');

    // Lists
    markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
    markdown = markdown.replace(/<ul>|<\/ul>/gi, '');

    // Blockquotes
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n');

    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Clean up HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    return markdown;
  }

  applyFormat(text, format) {
    switch (format) {
      case 'bold':
        return `**${text}**`;
      case 'italic':
        return `*${text}*`;
      case 'code':
        return `\`${text}\``;
      case 'link':
        return `[${text}](url)`;
      case 'heading1':
        return `# ${text}`;
      case 'heading2':
        return `## ${text}`;
      case 'heading3':
        return `### ${text}`;
      case 'quote':
        return `> ${text}`;
      case 'list':
        return `- ${text}`;
      default:
        return text;
    }
  }

  removeFormat(text) {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[|\]\(.*?\)/g, '')
      .replace(/^#{1,6}\s/gm, '')
      .replace(/^>\s/gm, '')
      .replace(/^[-*]\s/gm, '');
  }

  extractLinks(text) {
    const links = [];
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
      });
    }

    return links;
  }

  wordCount(text) {
    const cleanText = this.removeFormat(text);
    return cleanText.trim().split(/\s+/).filter((word) => word.length > 0).length;
  }

  characterCount(text, includeSpaces = true) {
    if (includeSpaces) {
      return text.length;
    }
    return text.replace(/\s/g, '').length;
  }

  readingTime(text, wordsPerMinute = 200) {
    const words = this.wordCount(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  getTextStats(text) {
    return {
      characters: this.characterCount(text, true),
      charactersNoSpaces: this.characterCount(text, false),
      words: this.wordCount(text),
      lines: text.split('\n').length,
      readingTime: this.readingTime(text),
      links: this.extractLinks(text).length,
    };
  }
}

export default new RichTextFormatter();
