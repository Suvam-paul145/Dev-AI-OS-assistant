/**
 * Permission Validator - Check permissions and enforce security
 * Requirements 6.1-6.5: Validate permissions, check roles, enforce policies
 */

import { PermissionPolicy, PermissionLevel, ExecutionPlan } from "./models";

export class PermissionValidator {
  private policies: Map<string, PermissionPolicy> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies(): void {
    // File operations
    this.policies.set("file:create", {
      action: "file:create",
      allowedRoles: ["user", "admin"],
      requiresApproval: false,
      riskLevel: "low"
    });

    this.policies.set("file:delete", {
      action: "file:delete",
      allowedRoles: ["admin"],
      requiresApproval: true,
      riskLevel: "high"
    });

    // App control
    this.policies.set("app:open", {
      action: "app:open",
      allowedRoles: ["user", "admin"],
      requiresApproval: false,
      riskLevel: "low"
    });

    this.policies.set("app:close", {
      action: "app:close",
      allowedRoles: ["user", "admin"],
      requiresApproval: false,
      riskLevel: "low"
    });

    // System operations
    this.policies.set("system:query", {
      action: "system:query",
      allowedRoles: ["user", "admin"],
      requiresApproval: false,
      riskLevel: "low"
    });

    this.policies.set("system:shutdown", {
      action: "system:shutdown",
      allowedRoles: ["admin"],
      requiresApproval: true,
      riskLevel: "critical"
    });

    // Settings
    this.policies.set("settings:change", {
      action: "settings:change",
      allowedRoles: ["user", "admin"],
      requiresApproval: false,
      riskLevel: "low"
    });
  }

  /**
   * Validate permission for action
   * Requirement 6.1: Check if user has permission
   * Requirement 6.2: Validate against role
   * Requirement 6.3: Check risk level
   */
  validatePermission(
    action: string,
    userRole: string,
    userId: string
  ): { allowed: boolean; requiresApproval: boolean; reason?: string } {
    const policy = this.policies.get(action);

    if (!policy) {
      return {
        allowed: true,
        requiresApproval: false,
        reason: "No policy found - allowing by default"
      };
    }

    const allowed = policy.allowedRoles.includes(userRole);

    if (!allowed) {
      return {
        allowed: false,
        requiresApproval: false,
        reason: `User role '${userRole}' not authorized for '${action}'`
      };
    }

    return {
      allowed: true,
      requiresApproval: policy.requiresApproval,
      reason: `Permission granted for user '${userId}'`
    };
  }

  /**
   * Validate execution plan for security
   * Requirement 6.4: Check all steps are approved
   * Requirement 6.5: Detect risky operations
   */
  validateExecutionPlan(
    plan: ExecutionPlan,
    userRole: string
  ): { safe: boolean; risks: string[]; blockedSteps: string[] } {
    const risks: string[] = [];
    const blockedSteps: string[] = [];

    for (const step of plan.steps) {
      // Check risk level
      if (step.riskLevel === "critical") {
        risks.push(`Critical risk in step: ${step.description}`);
      } else if (step.riskLevel === "high" && userRole !== "admin") {
        risks.push(`High risk operation requires admin role: ${step.description}`);
        blockedSteps.push(step.id);
      }

      // Check for dangerous patterns
      if (step.description.toLowerCase().includes("delete all")) {
        risks.push(`Dangerous operation detected: ${step.description}`);
        blockedSteps.push(step.id);
      }
    }

    return {
      safe: blockedSteps.length === 0,
      risks,
      blockedSteps
    };
  }

  /**
   * Add custom policy
   */
  addPolicy(policy: PermissionPolicy): void {
    this.policies.set(policy.action, policy);
  }

  /**
   * Get policy for action
   */
  getPolicy(action: string): PermissionPolicy | undefined {
    return this.policies.get(action);
  }

  /**
   * List all policies
   */
  listPolicies(): PermissionPolicy[] {
    return Array.from(this.policies.values());
  }
}
