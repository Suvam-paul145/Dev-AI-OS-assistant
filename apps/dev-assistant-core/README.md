# Dev Assistant Core

**Central Intelligence & Coordination System**

Handles command parsing, permission validation, multi-agent coordination, and response generation in multiple languages.

## Features

✅ **Command Parsing** - Normalize voice/text input with language detection  
✅ **Permission Validation** - Role-based access control with risk assessment  
✅ **Agent Coordination** - Decompose tasks and coordinate multiple agents  
✅ **Multi-language Support** - English, Hindi, and bilingual responses  
✅ **Task Execution** - Sequential and parallel task execution  
✅ **Response Generation** - Format responses for text/voice output  

## Architecture

```
User Input
    ↓
CommandParser (normalize, detect language)
    ↓
PermissionValidator (check permissions)
    ↓
AgentCoordinator (decompose & execute)
    ↓
ResponseGenerator (format output)
    ↓
User Output
```

## API Example

```typescript
import { AssistantCore } from "./src/main";
import { CommandSource } from "./src/models";

const assistant = new AssistantCore();

const result = await assistant.processCommand(
  "create a file named test.txt",
  "user123",
  "user",
  CommandSource.TEXT
);
// Returns: { command, response }
```

## Requirements Mapping

| Requirement | Implementation | Status |
|---|---|---|
| 5.1 | CommandParser (voice input parsing) | ✅ |
| 5.2 | CommandParser (text input parsing) | ✅ |
| 5.3 | Language detection (EN, HI) | ✅ |
| 6.1 | Permission validation | ✅ |
| 6.2 | Role-based access control | ✅ |
| 6.3 | Risk level assessment | ✅ |
| 6.4 | Execution plan validation | ✅ |
| 6.5 | Risk detection | ✅ |
| 7.1 | Task decomposition | ✅ |
| 7.2 | Dependency identification | ✅ |
| 7.3 | Execution optimization | ✅ |
| 7.4 | Multi-agent execution | ✅ |
| 7.5 | Agent communication | ✅ |
| 8.1 | Text response generation | ✅ |
| 8.2 | Multi-language support | ✅ |
| 8.3 | Format adaptation | ✅ |
