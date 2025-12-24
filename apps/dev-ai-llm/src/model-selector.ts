/**
 * Model Selector - Route to cloud or local LLM
 * Requirements 3.1-3.5: Select best model based on task/connectivity
 */

import { Intent, TaskComplexity, ModelConfig, LLMResponse } from "./models";

export class ModelSelector {
  private cloudConfig: ModelConfig = {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
    timeout: 5000
  };

  private localConfig: ModelConfig = {
    provider: "ollama",
    model: "mistral",
    endpoint: "http://localhost:11434",
    temperature: 0.7,
    maxTokens: 150,
    timeout: 3000
  };

  /**
   * Select best model based on task complexity and connectivity
   * Requirement 3.1-3.3: Route to appropriate model
   */
  selectModel(complexity: TaskComplexity, isOnline: boolean): ModelConfig {
    // Simple tasks: use local model for speed
    if (complexity === TaskComplexity.SIMPLE && isOnline === false) {
      return this.localConfig;
    }

    // Complex tasks: use cloud model for better understanding
    if (complexity === TaskComplexity.COMPLEX || complexity === TaskComplexity.MULTI_AGENT) {
      if (isOnline) {
        return this.cloudConfig;
      } else {
        return this.localConfig;
      }
    }

    // Default: use cloud if online, local if offline
    return isOnline ? this.cloudConfig : this.localConfig;
  }

  /**
   * Get fallback model if primary fails
   * Requirement 3.4: Fallback handling
   */
  getFallbackModel(primaryModel: ModelConfig): ModelConfig {
    if (primaryModel.provider === "openai") {
      // Fallback: Google Generative AI
      return {
        provider: "google",
        model: "gemini-pro",
        temperature: 0.7,
        maxTokens: 150,
        timeout: 5000
      };
    } else if (primaryModel.provider === "google") {
      // Fallback: Ollama local
      return this.localConfig;
    } else {
      // Fallback: offline default
      return this.localConfig;
    }
  }

  /**
   * Determine if using cloud or local
   * Requirement 3.5: Model availability check
   */
  isCloudModel(config: ModelConfig): boolean {
    return ["openai", "google"].includes(config.provider);
  }

  /**
   * Mock LLM response (in production, would call actual API)
   */
  async queryModel(config: ModelConfig, prompt: string): Promise<LLMResponse> {
    const start = Date.now();

    try {
      // Mock implementation - in production would call actual API
      const response = await this.mockLLMCall(config, prompt);
      const processingTime = Date.now() - start;

      return {
        text: response,
        language: "en",
        confidence: 0.85,
        modelUsed: config.provider,
        processingTimeMs: processingTime
      };
    } catch (error) {
      return {
        text: "",
        language: "en",
        confidence: 0,
        modelUsed: config.provider,
        processingTimeMs: Date.now() - start
      };
    }
  }

  /**
   * Mock LLM call for testing
   */
  private async mockLLMCall(config: ModelConfig, prompt: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (prompt.toLowerCase().includes("open")) {
          resolve("I'll open the application for you");
        } else if (prompt.toLowerCase().includes("create")) {
          resolve("Creating a new file in the specified location");
        } else if (prompt.toLowerCase().includes("delete")) {
          resolve("Deleting the file and sending to recycle bin");
        } else {
          resolve("Processing your request");
        }
      }, 500);
    });
  }
}
