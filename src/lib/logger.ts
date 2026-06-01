export type LogCategory = "sync" | "ai" | "backup" | "realtime";

export interface LogEntry {
  timestamp: string;
  category: LogCategory;
  message: string;
  error?: string;
  details?: any;
}

const LOG_KEY = "occasionly_error_logs";

export const logger = {
  log(category: LogCategory, message: string, error?: any, details?: any) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      category,
      message,
      error: errorMsg || undefined,
      details,
    };

    console.error(`[${category.toUpperCase()}] ${message}`, error || "");

    if (typeof window !== "undefined") {
      try {
        const existing = localStorage.getItem(LOG_KEY);
        const logs: LogEntry[] = existing ? JSON.parse(existing) : [];
        logs.unshift(entry);
        // Cap the error logs log-size to the last 100 entries
        localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 100)));
      } catch (e) {
        console.error("Failed to write to localStorage logger", e);
      }
    }
  },

  getLogs(): LogEntry[] {
    if (typeof window === "undefined") return [];
    try {
      const existing = localStorage.getItem(LOG_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      return [];
    }
  },

  clearLogs() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOG_KEY);
    }
  },
};
