/**
 * Task Router - Route commands to appropriate handlers
 * Requirements 4.1-4.5: Route to file, app, voice, or system handlers
 */

import { Intent, IntentType, Task, TaskComplexity } from "./models";

export class TaskRouter {
  /**
   * Route intent to appropriate handler
   * Requirement 4.1: Route file operations
   * Requirement 4.2: Route app control
   * Requirement 4.3: Route system queries
   * Requirement 4.4: Route voice commands
   * Requirement 4.5: Route settings
   */
  routeIntent(intent: Intent, complexity: TaskComplexity): Task {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (intent.type) {
      case IntentType.FILE_OPERATION:
        return this.routeFileOperation(taskId, intent, complexity);

      case IntentType.APP_CONTROL:
        return this.routeAppControl(taskId, intent, complexity);

      case IntentType.SYSTEM_QUERY:
        return this.routeSystemQuery(taskId, intent, complexity);

      case IntentType.VOICE_COMMAND:
        return this.routeVoiceCommand(taskId, intent, complexity);

      case IntentType.SETTINGS:
        return this.routeSettings(taskId, intent, complexity);

      default:
        return this.createDefaultTask(taskId, intent);
    }
  }

  /**
   * Route file operation (create, open, delete, copy, move, search)
   */
  private routeFileOperation(taskId: string, intent: Intent, complexity: TaskComplexity): Task {
    const fileName = intent.entities.find(e => e.type === "file")?.value || "unknown";

    const steps = this.buildFileOperationSteps(intent.action, fileName);

    return {
      id: taskId,
      name: `File Operation: ${intent.action}`,
      description: `${intent.action} file: ${fileName}`,
      steps,
      estimatedTimeMs: 2000,
      priority: this.calculatePriority(complexity),
      requiresApproval: intent.requiresConfirmation
    };
  }

  /**
   * Route app control (open, close, focus, minimize, maximize)
   */
  private routeAppControl(taskId: string, intent: Intent, complexity: TaskComplexity): Task {
    const appName = intent.entities.find(e => e.type === "app")?.value || "unknown";

    const steps = this.buildAppControlSteps(intent.action, appName);

    return {
      id: taskId,
      name: `App Control: ${intent.action}`,
      description: `${intent.action} application: ${appName}`,
      steps,
      estimatedTimeMs: 1500,
      priority: this.calculatePriority(complexity),
      requiresApproval: intent.requiresConfirmation
    };
  }

  /**
   * Route system query (list apps, check status, get info)
   */
  private routeSystemQuery(taskId: string, intent: Intent, complexity: TaskComplexity): Task {
    const steps = this.buildSystemQuerySteps(intent.action);

    return {
      id: taskId,
      name: `System Query: ${intent.action}`,
      description: `Query system information: ${intent.action}`,
      steps,
      estimatedTimeMs: 3000,
      priority: "low",
      requiresApproval: false
    };
  }

  /**
   * Route voice command (listen, acknowledge, speak)
   */
  private routeVoiceCommand(taskId: string, intent: Intent, complexity: TaskComplexity): Task {
    const steps = ["Activate voice system", "Listen for input", "Process audio"];

    return {
      id: taskId,
      name: "Voice Command",
      description: "Process voice input from user",
      steps,
      estimatedTimeMs: 5000,
      priority: "medium",
      requiresApproval: false
    };
  }

  /**
   * Route settings change (set language, enable features, etc)
   */
  private routeSettings(taskId: string, intent: Intent, complexity: TaskComplexity): Task {
    const setting = intent.entities.find(e => e.type === "parameter")?.value || "unknown";

    const steps = [
      `Identify setting: ${setting}`,
      "Validate change",
      "Apply configuration",
      "Save preferences"
    ];

    return {
      id: taskId,
      name: `Settings: ${intent.action}`,
      description: `${intent.action} setting: ${setting}`,
      steps,
      estimatedTimeMs: 1000,
      priority: "low",
      requiresApproval: intent.requiresConfirmation
    };
  }

  /**
   * Default task for unknown intents
   */
  private createDefaultTask(taskId: string, intent: Intent): Task {
    return {
      id: taskId,
      name: "Unknown Command",
      description: `Unable to parse intent: ${intent.action}`,
      steps: ["Clarify user intent", "Request additional information"],
      estimatedTimeMs: 2000,
      priority: "low",
      requiresApproval: true
    };
  }

  /**
   * Build steps for file operations
   */
  private buildFileOperationSteps(action: string, fileName: string): string[] {
    const baseSteps = [
      "Validate permissions",
      "Check file exists",
      "Perform action",
      "Log operation"
    ];

    const actionSpecific: { [key: string]: string } = {
      create: "Initialize new file",
      open: "Open in default application",
      delete: "Move to recycle bin",
      copy: "Duplicate file",
      move: "Relocate file",
      search: "Query file system"
    };

    return [
      ...baseSteps.slice(0, 2),
      actionSpecific[action] || "Process file",
      ...baseSteps.slice(3)
    ];
  }

  /**
   * Build steps for app control
   */
  private buildAppControlSteps(action: string, appName: string): string[] {
    const baseSteps = [
      "Locate application",
      "Check permissions",
      "Execute action",
      "Monitor status"
    ];

    return baseSteps;
  }

  /**
   * Build steps for system queries
   */
  private buildSystemQuerySteps(action: string): string[] {
    return [
      "Query system",
      "Collect information",
      "Format response",
      "Return results"
    ];
  }

  /**
   * Calculate priority based on complexity
   */
  private calculatePriority(complexity: TaskComplexity): "low" | "medium" | "high" | "critical" {
    switch (complexity) {
      case TaskComplexity.SIMPLE:
        return "low";
      case TaskComplexity.MODERATE:
        return "medium";
      case TaskComplexity.COMPLEX:
        return "high";
      case TaskComplexity.MULTI_AGENT:
        return "critical";
      default:
        return "medium";
    }
  }
}
