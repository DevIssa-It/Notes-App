/**
 * Word Counter
 * Count words, characters, and reading time
 */

class WordCounter {
  count(text) {
    return {
      characters: this.countCharacters(text),
      charactersNoSpaces: this.countCharactersNoSpaces(text),
      words: this.countWords(text),
      sentences: this.countSentences(text),
      paragraphs: this.countParagraphs(text),
      readingTime: this.estimateReadingTime(text),
    };
  }

  countCharacters(text) {
    return text.length;
  }

  countCharactersNoSpaces(text) {
    return text.replace(/\s/g, '').length;
  }

  countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  }

  countSentences(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
  }

  countParagraphs(text) {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.filter((p) => p.trim().length > 0).length;
  }

  estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = this.countWords(text);
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }

  getStats(text) {
    const stats = this.count(text);
    return {
      ...stats,
      readingTimeFormatted: this.formatReadingTime(stats.readingTime),
    };
  }

  formatReadingTime(minutes) {
    if (minutes < 1) return 'Less than 1 minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  }
}

export default new WordCounter();
