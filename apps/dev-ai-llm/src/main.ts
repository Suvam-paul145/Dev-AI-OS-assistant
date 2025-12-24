/**
 * AI/LLM System - Main Orchestrator
 * Combines intent recognition, model selection, and task routing
 */

import { IntentRecognizer } from "./intent-recognizer";
import { ModelSelector } from "./model-selector";
import { TaskRouter } from "./task-router";
import { LLMResponse, ParsedCommand } from "./models";

export class AILLMSystem {
  private intentRecognizer: IntentRecognizer;
  private modelSelector: ModelSelector;
  private taskRouter: TaskRouter;

  constructor() {
    this.intentRecognizer = new IntentRecognizer();
    this.modelSelector = new ModelSelector();
    this.taskRouter = new TaskRouter();
  }

  /**
   * Process user command end-to-end
   */
  async processCommand(userInput: string, isOnline: boolean = true): Promise<{
    command: ParsedCommand;
    response: LLMResponse;
    task: any;
  }> {
    console.log(`\n📝 Processing: "${userInput}"`);

    // Step 1: Parse command and recognize intent
    const command = this.intentRecognizer.parseCommand(userInput);
    console.log(`✓ Intent: ${command.intent.type}`);
    console.log(`✓ Action: ${command.intent.action}`);
    console.log(`✓ Confidence: ${(command.intent.confidence * 100).toFixed(0)}%`);

    // Step 2: Select appropriate model
    const model = this.modelSelector.selectModel(command.complexity, isOnline);
    console.log(`✓ Using model: ${model.provider}/${model.model}`);

    // Step 3: Query model for response
    const response = await this.modelSelector.queryModel(model, userInput);
    console.log(`✓ Response: "${response.text}"`);

    // Step 4: Route to task handler
    const task = this.taskRouter.routeIntent(command.intent, command.complexity);
    console.log(`✓ Task: ${task.name}`);
    console.log(`✓ Complexity: ${command.complexity}`);
    console.log(`✓ Steps:`);
    task.steps.forEach((step, idx) => console.log(`  ${idx + 1}. ${step}`));

    return { command, response, task };
  }
}

/**
 * Example usage
 */
async function example() {
  console.log("\n=== AI/LLM System Example ===\n");

  const aiSystem = new AILLMSystem();

  // Test commands
  const testCommands = [
    "open the file manager",
    "create a new document named test.txt",
    "delete the file report.pdf",
    "show me the running applications",
    "set language to hindi"
  ];

  for (const command of testCommands) {
    try {
      const result = await aiSystem.processCommand(command, true);
      console.log("");
    } catch (error) {
      console.error(`Error processing: ${error}`);
    }
  }

  console.log("\n✅ AI/LLM System Ready\n");
}

// Export for use as module
export { IntentRecognizer, ModelSelector, TaskRouter };

// Run example if executed directly
if (require.main === module) {
  example().catch(console.error);
}
