# Dev AI LLM System

**Language Model Integration & Intent Recognition**

Handles command parsing, intent extraction, entity recognition, and task routing with support for multiple LLM providers (OpenAI, Google, Ollama).

## Features

✅ **Intent Recognition** - Identify command intent (file ops, app control, queries)  
✅ **Entity Extraction** - Extract files, apps, paths, parameters from input  
✅ **Task Routing** - Route to appropriate handler based on intent  
✅ **Model Selection** - Choose cloud or local LLM based on task complexity  
✅ **Fallback Handling** - Automatic fallback if primary model fails  
✅ **Complexity Classification** - Classify tasks as simple, moderate, complex  

## Architecture

```
User Input
    ↓
IntentRecognizer (parse command, extract intent + entities)
    ↓
ModelSelector (choose cloud/local model)
    ↓
LLM Query (get AI response)
    ↓
TaskRouter (route to handler)
    ↓
Task Execution
```

## API Example

```typescript
import { AILLMSystem } from "./src/main";

const aiSystem = new AILLMSystem();

const result = await aiSystem.processCommand("open file manager", true);
// Returns: { command, response, task }
```

## Requirements Mapping

| Requirement | Implementation | Status |
|---|---|---|
| 1.1 | IntentRecognizer (intent extraction) | ✅ |
| 1.2 | Entity extraction (files, apps, params) | ✅ |
| 1.3 | Confidence scoring | ✅ |
| 1.4 | Pattern matching | ✅ |
| 1.5 | Error handling | ✅ |
| 2.0 | Task complexity classification | ✅ |
| 3.1 | ModelSelector initialization | ✅ |
| 3.2 | Cloud vs local routing | ✅ |
| 3.3 | Model configuration | ✅ |
| 3.4 | Fallback handling | ✅ |
| 3.5 | Model availability check | ✅ |
| 4.1 | File operation routing | ✅ |
| 4.2 | App control routing | ✅ |
| 4.3 | System query routing | ✅ |
| 4.4 | Voice command routing | ✅ |
| 4.5 | Settings routing | ✅ |
