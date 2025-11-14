/**
 * Tag Manager
 * Manage tags/categories for notes
 */

class TagManager {
  constructor() {
    this.tags = this.loadTags();
    this.tagColors = [
      '#7c3aed', // Purple
      '#06b6d4', // Cyan
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#ec4899', // Pink
      '#8b5cf6', // Violet
      '#14b8a6', // Teal
    ];
  }

  loadTags() {
    try {
      const saved = localStorage.getItem('note-tags');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveTags() {
    try {
      localStorage.setItem('note-tags', JSON.stringify(this.tags));
    } catch {
      // Silent error
    }
  }

  addTag(name, color = null) {
    const tagName = name.trim().toLowerCase();
    
    if (!tagName) return null;
    
    const existing = this.tags.find((t) => t.name === tagName);
    if (existing) return existing;

    const tag = {
      id: this.generateTagId(),
      name: tagName,
      color: color || this.getRandomColor(),
      count: 0,
      createdAt: new Date().toISOString(),
    };

    this.tags.push(tag);
    this.saveTags();
    return tag;
  }

  removeTag(tagId) {
    const index = this.tags.findIndex((t) => t.id === tagId);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.saveTags();
      return true;
    }
    return false;
  }

  getTag(tagId) {
    return this.tags.find((t) => t.id === tagId);
  }

  getTagByName(name) {
    return this.tags.find((t) => t.name === name.toLowerCase());
  }

  getAllTags() {
    return [...this.tags].sort((a, b) => b.count - a.count);
  }

  incrementTagCount(tagId) {
    const tag = this.getTag(tagId);
    if (tag) {
      tag.count += 1;
      this.saveTags();
    }
  }

  decrementTagCount(tagId) {
    const tag = this.getTag(tagId);
    if (tag && tag.count > 0) {
      tag.count -= 1;
      this.saveTags();
    }
  }

  updateTagCount(tagId, count) {
    const tag = this.getTag(tagId);
    if (tag) {
      tag.count = Math.max(0, count);
      this.saveTags();
    }
  }

  renameTag(tagId, newName) {
    const tag = this.getTag(tagId);
    if (tag) {
      tag.name = newName.trim().toLowerCase();
      this.saveTags();
      return true;
    }
    return false;
  }

  changeTagColor(tagId, newColor) {
    const tag = this.getTag(tagId);
    if (tag) {
      tag.color = newColor;
      this.saveTags();
      return true;
    }
    return false;
  }

  getRandomColor() {
    return this.tagColors[Math.floor(Math.random() * this.tagColors.length)];
  }

  generateTagId() {
    return `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getPopularTags(limit = 5) {
    return this.getAllTags().slice(0, limit);
  }

  searchTags(query) {
    const q = query.toLowerCase();
    return this.tags.filter((tag) => tag.name.includes(q));
  }

  getTagStats() {
    return {
      totalTags: this.tags.length,
      totalUsage: this.tags.reduce((sum, tag) => sum + tag.count, 0),
      mostUsed: this.tags.reduce((max, tag) => (tag.count > max.count ? tag : max), 
        { count: 0, name: 'none' }),
      leastUsed: this.tags.reduce((min, tag) => (tag.count < min.count ? tag : min), 
        { count: Infinity, name: 'none' }),
    };
  }

  exportTags() {
    return {
      tags: this.tags,
      timestamp: new Date().toISOString(),
      stats: this.getTagStats(),
    };
  }

  importTags(tagsData) {
    if (Array.isArray(tagsData)) {
      this.tags = tagsData;
      this.saveTags();
      return true;
    }
    return false;
  }

  clearUnusedTags() {
    this.tags = this.tags.filter((tag) => tag.count > 0);
    this.saveTags();
  }
}

export default new TagManager();
