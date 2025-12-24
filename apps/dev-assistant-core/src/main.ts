/**
 * Assistant Core - Main Orchestrator
 * Integrates command parsing, permission validation, agent coordination, and response generation
 */

import { CommandParser } from "./command-parser";
import { PermissionValidator } from "./permission-validator";
import { AgentCoordinator } from "./agent-coordinator";
import { ResponseGenerator } from "./response-generator";
import { Command, CommandSource, Response } from "./models";

export class AssistantCore {
  private commandParser: CommandParser;
  private permissionValidator: PermissionValidator;
  private agentCoordinator: AgentCoordinator;
  private responseGenerator: ResponseGenerator;

  constructor() {
    this.commandParser = new CommandParser();
    this.permissionValidator = new PermissionValidator();
    this.agentCoordinator = new AgentCoordinator();
    this.responseGenerator = new ResponseGenerator();
  }

  /**
   * Process user command end-to-end
   */
  async processCommand(
    input: string,
    userId: string = "default",
    userRole: string = "user",
    source: CommandSource = CommandSource.TEXT
  ): Promise<{ command: Command; response: Response }> {
    console.log(`\n📢 Processing: "${input}"`);

    // Step 1: Parse command
    const command = this.commandParser.parseCommand(input, source, userId, "en");
    console.log(`✓ Command parsed (ID: ${command.id})`);
    console.log(`✓ Language: ${command.language}`);

    // Step 2: Validate permissions
    const actionName = "file:create"; // Would be determined from parsed intent
    const permission = this.permissionValidator.validatePermission(actionName, userRole, userId);

    if (!permission.allowed) {
      console.log(`✗ Permission denied: ${permission.reason}`);
      const response = this.responseGenerator.generateResponse(
        command.id,
        { error: "Permission denied", message: permission.reason },
        command.language,
        source
      );
      return { command, response };
    }

    console.log(`✓ Permission granted (requires approval: ${permission.requiresApproval})`);

    // Step 3: Decompose task
    const plan = this.agentCoordinator.decomposeTask(
      command.id,
      input,
      "moderate"
    );
    console.log(`✓ Task decomposed into ${plan.steps.length} steps`);
    console.log(`✓ Estimated duration: ${plan.estimatedDurationMs}ms`);

    // Step 4: Execute plan
    const execution = await this.agentCoordinator.executePlan(plan);
    console.log(`✓ Execution completed (success: ${execution.success})`);

    // Step 5: Generate response
    const response = this.responseGenerator.generateResponse(
      command.id,
      execution.results,
      command.language,
      source
    );
    console.log(`✓ Response generated`);

    return { command, response };
  }
}

/**
 * Example usage
 */
async function example() {
  console.log("\n=== Assistant Core Example ===\n");

  const assistant = new AssistantCore();

  // Test commands
  const testCommands = [
    { input: "create a file named test.txt", role: "user", source: CommandSource.TEXT },
    { input: "open notepad", role: "user", source: CommandSource.TEXT },
    { input: "delete important.doc", role: "user", source: CommandSource.TEXT },
    { input: "show running applications", role: "user", source: CommandSource.VOICE }
  ];

  for (const test of testCommands) {
    try {
      const result = await assistant.processCommand(
        test.input,
        "user123",
        test.role,
        test.source as CommandSource
      );
      console.log(`→ Response: "${result.response.text}"\n`);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  console.log("\n✅ Assistant Core Ready\n");
}

// Export for use as module
export { CommandParser, PermissionValidator, AgentCoordinator, ResponseGenerator };

// Run example if executed directly
if (require.main === module) {
  example().catch(console.error);
}
