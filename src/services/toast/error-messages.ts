/**
 * Human-friendly error messages mapper.
 * Maps technical or database error messages to warm, clear, conversational user-facing copy.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return "Something went wrong. Please try again.";

  const message = typeof error === "string" ? error : error.message || "";
  const msgLower = message.toLowerCase();

  // Network and Connectivity
  if (
    msgLower.includes("network") ||
    msgLower.includes("failed to fetch") ||
    msgLower.includes("load failed") ||
    msgLower.includes("connectivity")
  ) {
    return "Couldn’t sync right now. We’ll retry automatically.";
  }

  // Offline indicator
  if (msgLower.includes("offline") || msgLower.includes("no internet")) {
    return "You're offline. Changes are saved locally and will sync when you're back.";
  }

  // Timing & timeouts
  if (msgLower.includes("timeout") || msgLower.includes("timed out")) {
    return "This is taking longer than usual. We'll keep trying in the background.";
  }

  // Auth: Credentials
  if (msgLower.includes("invalid login credentials") || msgLower.includes("invalid credentials")) {
    return "Incorrect email or password. Please double check.";
  }

  // Auth: Email confirmation
  if (msgLower.includes("email not confirmed") || msgLower.includes("confirm your email")) {
    return "Please check your inbox and verify your email address to sign in.";
  }

  // Auth: Existing user
  if (msgLower.includes("user already exists") || msgLower.includes("email already in use")) {
    return "An account with this email already exists.";
  }

  // Push notification permissions
  if (
    msgLower.includes("permission denied") ||
    msgLower.includes("notifications not allowed") ||
    msgLower.includes("pushManager.subscribe") ||
    msgLower.includes("permission")
  ) {
    return "Notification access was blocked. You can enable them in your browser settings.";
  }

  // Duplication/Constraint issues
  if (msgLower.includes("reminder already exists") || msgLower.includes("duplicate key")) {
    return "This reminder already exists in your vault.";
  }

  // Backup / localDB errors
  if (msgLower.includes("database") || msgLower.includes("dexie") || msgLower.includes("indexeddb")) {
    return "Local storage issue. Your data is safe, and we are working to recover.";
  }

  // Generic fallback if not matched, but make it friendly if it's long/technical
  if (message.length > 80 || msgLower.includes("exception") || msgLower.includes("error code")) {
    return "Something went wrong on our end. We're automatically retrying.";
  }

  return message;
}
