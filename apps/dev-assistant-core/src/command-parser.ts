/**
 * Command Parser - Normalize and parse user input
 * Requirements 5.1-5.3: Parse voice/text input, handle multiple languages
 */

import { Command, CommandSource } from "./models";

export class CommandParser {
  /**
   * Parse incoming command from any source
   * Requirement 5.1: Parse voice input
   * Requirement 5.2: Parse text input
   * Requirement 5.3: Handle multiple languages (EN, HI)
   */
  parseCommand(
    input: string,
    source: CommandSource = CommandSource.TEXT,
    userId: string = "default",
    language: string = "en"
  ): Command {
    const normalized = this.normalizeInput(input, language);
    const detectedLanguage = this.detectLanguage(input);

    return {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      originalText: input,
      timestamp: new Date(),
      userId,
      language: detectedLanguage || language
    };
  }

  /**
   * Normalize input text (remove extra spaces, lowercase, etc)
   */
  private normalizeInput(text: string, language: string): string {
    // Remove multiple spaces
    let normalized = text.trim().replace(/\s+/g, " ");

    // Language-specific normalization
    if (language === "hi" || language === "hi-en") {
      // Handle Hindi diacritics if needed
      normalized = normalized.toLowerCase();
    } else {
      normalized = normalized.toLowerCase();
    }

    // Remove common punctuation
    normalized = normalized.replace(/[.,!?;:'"]/g, "");

    return normalized;
  }

  /**
   * Detect language from input text
   * Requirement 5.3: Language detection
   */
  private detectLanguage(text: string): string {
    const hindiChars = /[\u0900-\u097F]/g;
    const hindiMatches = text.match(hindiChars) || [];

    const englishChars = /[A-Za-z]/g;
    const englishMatches = text.match(englishChars) || [];

    // If both languages present
    if (hindiMatches.length > 0 && englishMatches.length > 0) {
      return "hi-en"; // Bilingual
    }

    // If mostly Hindi
    if (hindiMatches.length > englishMatches.length && hindiMatches.length > 0) {
      return "hi";
    }

    // Default to English
    return "en";
  }

  /**
   * Extract command components (verb, object, parameters)
   */
  extractComponents(
    command: Command
  ): { verb: string; object: string; parameters: string[] } {
    const text = command.originalText.toLowerCase();
    const words = text.split(/\s+/);

    let verb = "";
    let object = "";
    const parameters: string[] = [];

    // Simple heuristic: first meaningful word is verb, second is object
    const stopWords = ["the", "a", "an", "and", "or", "in", "of", "to"];

    for (let i = 0; i < words.length; i++) {
      if (!stopWords.includes(words[i])) {
        if (!verb) {
          verb = words[i];
        } else if (!object) {
          object = words[i];
        } else {
          parameters.push(words[i]);
        }
      }
    }

    return { verb, object, parameters };
  }

  /**
   * Validate command format
   */
  validateCommand(command: Command): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!command.originalText || command.originalText.trim().length === 0) {
      errors.push("Command text cannot be empty");
    }

    if (!command.userId) {
      errors.push("User ID is required");
    }

    if (!command.language) {
      errors.push("Language specification is required");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
