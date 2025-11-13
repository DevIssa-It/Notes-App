/**
 * Performance Monitor
 * Tracks and reports app performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: 0,
      apiCalls: [],
      renders: [],
      interactions: [],
    };
    this.init();
  }

  init() {
    // Measure page load time
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const { timing } = window.performance;
        this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
      });
    }

    // Monitor API calls
    this.interceptFetch();
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.recordAPICall({
          url: args[0],
          duration: endTime - startTime,
          status: response.status,
          timestamp: new Date().toISOString(),
        });
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.recordAPICall({
          url: args[0],
          duration: endTime - startTime,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }
    };
  }

  recordAPICall(data) {
    this.metrics.apiCalls.push(data);
    
    // Keep only last 50 API calls
    if (this.metrics.apiCalls.length > 50) {
      this.metrics.apiCalls.shift();
    }
  }

  recordRender(componentName, duration) {
    this.metrics.renders.push({
      component: componentName,
      duration,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 renders
    if (this.metrics.renders.length > 50) {
      this.metrics.renders.shift();
    }
  }

  recordInteraction(action, duration) {
    this.metrics.interactions.push({
      action,
      duration,
      timestamp: new Date().toISOString(),
    });
    
    // Keep only last 50 interactions
    if (this.metrics.interactions.length > 50) {
      this.metrics.interactions.shift();
    }
  }

  getMetrics() {
    return {
      pageLoad: this.metrics.pageLoad,
      avgAPITime: this.getAverageAPITime(),
      avgRenderTime: this.getAverageRenderTime(),
      avgInteractionTime: this.getAverageInteractionTime(),
      totalAPICalls: this.metrics.apiCalls.length,
      totalRenders: this.metrics.renders.length,
      totalInteractions: this.metrics.interactions.length,
    };
  }

  getAverageAPITime() {
    if (this.metrics.apiCalls.length === 0) return 0;
    const total = this.metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0);
    return total / this.metrics.apiCalls.length;
  }

  getAverageRenderTime() {
    if (this.metrics.renders.length === 0) return 0;
    const total = this.metrics.renders.reduce((sum, render) => sum + render.duration, 0);
    return total / this.metrics.renders.length;
  }

  getAverageInteractionTime() {
    if (this.metrics.interactions.length === 0) return 0;
    const total = this.metrics.interactions.reduce(
      (sum, interaction) => sum + interaction.duration,
      0
    );
    return total / this.metrics.interactions.length;
  }

  getSummary() {
    const metrics = this.getMetrics();
    return `
Performance Summary:
-------------------
Page Load Time: ${metrics.pageLoad}ms
Average API Response: ${metrics.avgAPITime.toFixed(2)}ms
Average Render Time: ${metrics.avgRenderTime.toFixed(2)}ms
Average Interaction Time: ${metrics.avgInteractionTime.toFixed(2)}ms
Total API Calls: ${metrics.totalAPICalls}
Total Renders: ${metrics.totalRenders}
Total Interactions: ${metrics.totalInteractions}
    `.trim();
  }

  exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      details: {
        apiCalls: this.metrics.apiCalls,
        renders: this.metrics.renders,
        interactions: this.metrics.interactions,
      },
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Helper function to measure component render time
export function measureRender(componentName, fn) {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  performanceMonitor.recordRender(componentName, endTime - startTime);
  
  return result;
}

// Helper function to measure interaction time
export function measureInteraction(actionName, fn) {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  performanceMonitor.recordInteraction(actionName, endTime - startTime);
  
  return result;
}

// Helper function for async operations
export async function measureAsync(name, fn) {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  
  performanceMonitor.recordInteraction(name, endTime - startTime);
  
  return result;
}
