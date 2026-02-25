/**
 * Removes control characters from a string
 * @param str - The string to clean
 * @returns String with control characters removed
 */
function removeControlCharacters(str: string): string {
  // Remove control characters (0-31 and 127) using a different approach
  return str
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("");
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for HTML attributes
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Normalize whitespace early
  let sanitized = input.replace(/\s+/g, " ").trim();

  // Strip dangerous protocols and constructs (multi‑char patterns)
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /eval\s*\(/gi,
    /url\s*\(/gi,
  ];

  dangerousPatterns.forEach((pattern) => {
    // Ensure we remove *all* occurrences, not just the first
    pattern.lastIndex = 0;
    while (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, "");
      pattern.lastIndex = 0;
    }
  });

  // Encode/strip characters that can open XSS vectors in attributes
  sanitized = sanitized
    // Escape ampersands first
    .replace(/&/g, "&amp;")
    // Escape quotes
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Remove angle brackets entirely (no tags)
    .replace(/[<>]/g, "")
    // Remove backticks
    .replace(/`/g, "")
    // Remove backslashes
    .replace(/\\/g, "")
    // Remove null bytes
    .replace(/\0/g, "")
    // Normalize whitespace again
    .replace(/\s+/g, " ")
    .trim();

  // Remove control characters
  sanitized = removeControlCharacters(sanitized);

  return sanitized;
}

/**
 * Sanitizes input specifically for HTML content (less restrictive than attribute sanitization)
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for HTML content
 */
export function sanitizeHtmlContent(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  const result = input
    // Remove script tags and their content (handles whitespace in closing tags)
    .replace(/<script[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, "")
    // Remove data: protocol
    .replace(/data:/gi, "")
    // Remove all event handlers (onXXX=)
    .replace(/on\w+\s*=/gi, "")
    // Remove CSS expressions
    .replace(/expression\s*\(/gi, "")
    // Remove eval() calls
    .replace(/eval\s*\(/gi, "")
    // Remove dangerous CSS properties
    .replace(/url\s*\(/gi, "")
    // Remove null bytes
    .replace(/\0/g, "")
    .trim();

  // Remove control characters
  return removeControlCharacters(result);
}

/**
 * Validates if input contains only safe characters for Islamic text
 * @param input - The user input to validate
 * @returns true if input is safe for Islamic text display
 */
export function isValidIslamicText(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  // Allow Arabic characters, English letters, numbers, and basic punctuation
  // Use a simpler approach that avoids complex Unicode ranges
  const safeRanges = [
    [0x0600, 0x06ff], // Arabic
    [0x0750, 0x077f], // Arabic Supplement
    [0x08a0, 0x08ff], // Arabic Extended-A
    [0xfb50, 0xfdff], // Arabic Presentation Forms-A
    [0xfe70, 0xfeff], // Arabic Presentation Forms-B
    [0x0020, 0x007e], // Basic Latin
    [0x00a0, 0x00ff], // Latin-1 Supplement
    [0x0100, 0x017f], // Latin Extended-A
    [0x0180, 0x024f], // Latin Extended-B
    [0x1e00, 0x1eff], // Latin Extended Additional
  ];

  // Check if each character in the input is within a safe range
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const isSafe = safeRanges.some(
      ([start, end]) => charCode >= start && charCode <= end,
    );
    if (!isSafe) {
      return false;
    }
  }

  return true;
}
