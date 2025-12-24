/**
 * Assistant Core - Data Models & Interfaces
 * Requirements 5.1-8.5: Command parsing, intent resolution, coordination
 */

export enum CommandSource {
  VOICE = "voice",
  TEXT = "text",
  GUI = "gui",
  API = "api"
}

export enum PermissionLevel {
  PUBLIC = "public",
  USER = "user",
  ADMIN = "admin",
  SYSTEM = "system"
}

export interface Command {
  id: string;
  source: CommandSource;
  originalText: string;
  timestamp: Date;
  userId: string;
  language: string;
}

export interface Agent {
  id: string;
  name: string;
  capability: string;
  status: "idle" | "busy" | "error";
  priority: number;
}

export interface Response {
  commandId: string;
  text: string;
  language: string;      // en, hi, hi-en
  format: "text" | "speech" | "hybrid";
  confidence: number;
  processingTimeMs: number;
}

export interface PermissionPolicy {
  action: string;
  allowedRoles: string[];
  requiresApproval: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface ContextSnapshot {
  userId: string;
  sessionId: string;
  recentCommands: Command[];
  lastAction: string;
  timestamp: Date;
}

export interface ExecutionPlan {
  commandId: string;
  steps: ExecutionStep[];
  estimatedDurationMs: number;
  requiredApprovals: string[];
  parallelizable: boolean;
}

export interface ExecutionStep {
  id: string;
  description: string;
  agent: string;
  dependencies: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AgentMessage {
  from: string;
  to: string;
  type: string; // request, response, broadcast, error
  payload: any;
  timestamp: Date;
}
