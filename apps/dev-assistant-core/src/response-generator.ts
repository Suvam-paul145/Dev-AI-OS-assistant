/**
 * Response Generator - Format output in appropriate language/format
 * Requirements 8.1-8.3: Generate text responses, support multiple languages
 */

import { Response, CommandSource } from "./models";

export class ResponseGenerator {
  /**
   * Generate response for user
   * Requirement 8.1: Generate text response
   * Requirement 8.2: Support EN and HI languages
   * Requirement 8.3: Format appropriately for source
   */
  generateResponse(
    commandId: string,
    result: any,
    language: string = "en",
    source: CommandSource = CommandSource.TEXT
  ): Response {
    const start = Date.now();

    // Generate text based on language
    const text = this.generateText(result, language);

    // Determine format based on source
    const format = source === CommandSource.VOICE ? "speech" : "text";

    const response: Response = {
      commandId,
      text,
      language,
      format,
      confidence: 0.9,
      processingTimeMs: Date.now() - start
    };

    return response;
  }

  /**
   * Generate natural language response
   */
  private generateText(result: any, language: string): string {
    if (language === "hi") {
      return this.generateHindiResponse(result);
    } else if (language === "hi-en") {
      return this.generateBilingualResponse(result);
    } else {
      return this.generateEnglishResponse(result);
    }
  }

  /**
   * Generate English response
   */
  private generateEnglishResponse(result: any): string {
    if (!result) {
      return "Unable to process request";
    }

    if (typeof result === "string") {
      return result;
    }

    if (result.success === false) {
      return `Error: ${result.error || "Operation failed"}`;
    }

    if (result.message) {
      return result.message;
    }

    if (Array.isArray(result)) {
      return `Found ${result.length} items`;
    }

    return JSON.stringify(result);
  }

  /**
   * Generate Hindi response
   */
  private generateHindiResponse(result: any): string {
    if (!result) {
      return "अनुरोध को संसाधित नहीं कर सका";
    }

    if (typeof result === "string") {
      return this.translateToHindi(result);
    }

    if (result.success === false) {
      return `त्रुटि: ${result.error || "ऑपरेशन विफल रहा"}`;
    }

    if (Array.isArray(result)) {
      return `${result.length} आइटम मिले`;
    }

    return JSON.stringify(result);
  }

  /**
   * Generate bilingual response (English + Hindi)
   */
  private generateBilingualResponse(result: any): string {
    const english = this.generateEnglishResponse(result);
    const hindi = this.generateHindiResponse(result);

    return `${english} | ${hindi}`;
  }

  /**
   * Simple translation helper (in production would use translation API)
   */
  private translateToHindi(text: string): string {
    const translations: { [key: string]: string } = {
      "File created": "फ़ाइल बनाई गई",
      "File deleted": "फ़ाइल हटाई गई",
      "Application opened": "एप्लिकेशन खोला गया",
      "Application closed": "एप्लिकेशन बंद किया गया",
      "Operation completed": "ऑपरेशन पूर्ण हुआ",
      "Operation failed": "ऑपरेशन विफल रहा"
    };

    for (const [en, hi] of Object.entries(translations)) {
      if (text.toLowerCase().includes(en.toLowerCase())) {
        return text.replace(new RegExp(en, "i"), hi);
      }
    }

    return text; // Return original if no translation found
  }

  /**
   * Format response for voice output
   */
  formatForVoice(response: Response): string {
    // Remove special characters that might not render well in speech
    let formatted = response.text;
    formatted = formatted.replace(/[^\w\s\-\.]/g, "");
    formatted = formatted.replace(/\s+/g, " ");

    return formatted.trim();
  }

  /**
   * Format response for display
   */
  formatForDisplay(response: Response): string {
    return `${response.text}\n[${response.language.toUpperCase()}] - ${response.confidence * 100}% confidence`;
  }
}
