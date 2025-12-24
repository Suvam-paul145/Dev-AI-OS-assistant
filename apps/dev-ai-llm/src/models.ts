/**
 * AI/LLM - Data Models & Interfaces
 * Requirements 1.1-5.0: Intent recognition, entity extraction, task routing
 */

export enum IntentType {
  FILE_OPERATION = "file_operation",
  APP_CONTROL = "app_control",
  SYSTEM_QUERY = "system_query",
  VOICE_COMMAND = "voice_command",
  SETTINGS = "settings",
  UNKNOWN = "unknown"
}

export enum TaskComplexity {
  SIMPLE = "simple",      // Single action
  MODERATE = "moderate",  // 2-3 steps
  COMPLEX = "complex",    // Multi-step workflow
  MULTI_AGENT = "multi_agent" // Requires coordination
}

export interface Entity {
  type: string;           // file, app, parameter, etc.
  value: string;          // actual value
  confidence: number;     // 0-1 confidence score
}

export interface Intent {
  type: IntentType;
  action: string;        // specific action (open, close, create, etc.)
  entities: Entity[];
  confidence: number;    // 0-1 overall confidence
  requiresConfirmation: boolean;
}

export interface ParsedCommand {
  originalText: string;
  intent: Intent;
  complexity: TaskComplexity;
  requiresApproval: boolean;
  timestamp: Date;
}

export interface LLMResponse {
  text: string;
  language: string;       // en, hi, hi-en
  confidence: number;
  modelUsed: string;      // openai, google, ollama
  processingTimeMs: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  steps: string[];
  estimatedTimeMs: number;
  priority: "low" | "medium" | "high" | "critical";
  requiresApproval: boolean;
}

export interface ModelConfig {
  provider: "openai" | "google" | "ollama" | "local";
  model: string;
  apiKey?: string;
  endpoint?: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

export interface ContextMemory {
  userId: string;
  sessionId: string;
  recentIntents: Intent[];
  entities: Map<string, Entity>;
  lastUpdated: Date;
}
