/**
 * AI Assistant
 * AI-powered note suggestions and improvements
 */

class AIAssistant {
  suggestTags(noteContent) {
    const keywords = this.extractKeywords(noteContent);
    return keywords.slice(0, 5);
  }

  extractKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 4);

    const frequency = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
      .slice(0, 10);
  }

  suggestTitle(noteContent) {
    const lines = noteContent.split('\n').filter((line) => line.trim());
    if (lines.length === 0) return 'Untitled Note';

    const firstLine = lines[0].replace(/[#*`]/g, '').trim();
    return firstLine.slice(0, 50) || 'Untitled Note';
  }

  improveText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
  }

  summarize(text, maxLength = 100) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const summary = sentences.reduce((acc, sentence) => {
      if ((acc + sentence).length <= maxLength) {
        return acc + sentence;
      }
      return acc;
    }, '');

    return summary.trim() || text.slice(0, maxLength);
  }

  detectLanguage(text) {
    const patterns = {
      javascript: /function|const|let|var|=>|class/,
      python: /def |import |from |print\(|class /,
      java: /public |private |class |void |int |String/,
      html: /<[^>]+>/,
      css: /\{[^}]*:[^}]*\}/,
    };

    const matches = Object.entries(patterns)
      .filter(([, pattern]) => pattern.test(text))
      .map(([lang]) => lang);

    return matches[0] || 'text';
  }

  suggestRelatedNotes(noteContent, allNotes) {
    const keywords = this.extractKeywords(noteContent);
    
    return allNotes
      .map((note) => ({
        note,
        score: this.calculateSimilarity(keywords, note.body),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.note);
  }

  calculateSimilarity(keywords, text) {
    const textLower = text.toLowerCase();
    return keywords.reduce((score, keyword) => (
      score + (textLower.includes(keyword) ? 1 : 0)
    ), 0);
  }
}

export default new AIAssistant();
