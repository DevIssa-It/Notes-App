/**
 * Template Manager
 * Manage note templates for quick creation
 */

class TemplateManager {
  constructor() {
    this.templates = this.loadTemplates();
    this.initDefaultTemplates();
  }

  loadTemplates() {
    try {
      const saved = localStorage.getItem('note-templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveTemplates() {
    try {
      localStorage.setItem('note-templates', JSON.stringify(this.templates));
    } catch {
      // Silent error
    }
  }

  initDefaultTemplates() {
    if (this.templates.length === 0) {
      this.addDefaultTemplates();
    }
  }

  addDefaultTemplates() {
    const defaults = [
      {
        name: 'Meeting Notes',
        icon: '📝',
        content: `# Meeting Notes

**Date:** {{date}}
**Attendees:** 
**Agenda:**

## Discussion Points
- 

## Action Items
- [ ] 

## Next Steps
`,
      },
      {
        name: 'To-Do List',
        icon: '✅',
        content: `# To-Do List

**Date:** {{date}}

## High Priority
- [ ] 

## Medium Priority
- [ ] 

## Low Priority
- [ ] 

## Notes
`,
      },
      {
        name: 'Daily Journal',
        icon: '📔',
        content: `# Daily Journal

**Date:** {{date}}

## Today's Goals
- 

## Highlights
- 

## Challenges
- 

## Learnings
- 

## Tomorrow's Focus
- 
`,
      },
      {
        name: 'Project Plan',
        icon: '🎯',
        content: `# Project Plan

**Project Name:** 
**Start Date:** {{date}}
**Deadline:** 

## Objectives
- 

## Milestones
1. 

## Resources Needed
- 

## Risks & Mitigation
- 

## Success Criteria
- 
`,
      },
      {
        name: 'Book Notes',
        icon: '📚',
        content: `# Book Notes

**Title:** 
**Author:** 
**Date Started:** {{date}}

## Key Takeaways
- 

## Favorite Quotes
> 

## My Thoughts
`,
      },
      {
        name: 'Code Snippet',
        icon: '💻',
        content: `# Code Snippet

**Language:** 
**Purpose:** 
**Date:** {{date}}

## Code
\`\`\`
// Your code here
\`\`\`

## Explanation


## Usage Example
\`\`\`
// Example
\`\`\`
`,
      },
    ];

    defaults.forEach((template) => {
      this.createTemplate(template.name, template.content, template.icon);
    });
  }

  createTemplate(name, content, icon = '📄') {
    const template = {
      id: this.generateTemplateId(),
      name: name.trim(),
      content,
      icon,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.templates.push(template);
    this.saveTemplates();
    return template;
  }

  updateTemplate(templateId, updates) {
    const template = this.getTemplate(templateId);
    if (template) {
      Object.assign(template, updates, {
        updatedAt: new Date().toISOString(),
      });
      this.saveTemplates();
      return true;
    }
    return false;
  }

  deleteTemplate(templateId) {
    const index = this.templates.findIndex((t) => t.id === templateId);
    if (index > -1) {
      this.templates.splice(index, 1);
      this.saveTemplates();
      return true;
    }
    return false;
  }

  getTemplate(templateId) {
    return this.templates.find((t) => t.id === templateId);
  }

  getAllTemplates() {
    return [...this.templates].sort((a, b) => b.usageCount - a.usageCount);
  }

  useTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    template.usageCount += 1;
    this.saveTemplates();

    return this.processTemplate(template.content);
  }

  processTemplate(content) {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    return content
      .replace(/\{\{date\}\}/g, dateStr)
      .replace(/\{\{time\}\}/g, timeStr)
      .replace(/\{\{datetime\}\}/g, `${dateStr} ${timeStr}`)
      .replace(/\{\{year\}\}/g, now.getFullYear().toString())
      .replace(/\{\{month\}\}/g, (now.getMonth() + 1).toString().padStart(2, '0'))
      .replace(/\{\{day\}\}/g, now.getDate().toString().padStart(2, '0'));
  }

  searchTemplates(query) {
    const q = query.toLowerCase();
    return this.templates.filter((template) => 
      template.name.toLowerCase().includes(q) ||
      template.content.toLowerCase().includes(q)
    );
  }

  getMostUsedTemplates(limit = 5) {
    return this.getAllTemplates().slice(0, limit);
  }

  generateTemplateId() {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  exportTemplates() {
    return {
      templates: this.templates,
      timestamp: new Date().toISOString(),
    };
  }

  importTemplates(templatesData) {
    if (Array.isArray(templatesData)) {
      this.templates = templatesData;
      this.saveTemplates();
      return true;
    }
    return false;
  }

  resetToDefaults() {
    this.templates = [];
    this.addDefaultTemplates();
  }
}

export default new TemplateManager();
