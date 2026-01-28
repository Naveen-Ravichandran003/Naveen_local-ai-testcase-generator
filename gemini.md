# Gemini - Project Constitution (BLAST)

## Data Schemas

### Input Payload (User Request)
```json
{
  "userInput": "string",
  "context": "string (optional)",
  "templateVersion": "v1"
}
```

### Output Payload (Generated Test Case)
```json
{
  "testCases": [
    {
      "id": "TC-001",
      "title": "string",
      "priority": "High | Medium | Low",
      "preconditions": "string",
      "steps": ["step 1", "step 2"],
      "expectedResult": "string"
    }
  ],
  "summary": "string"
}
```

## Behavioral Rules
- **Privacy First**: All data processing must happen locally via Ollama.
- **UI Excellence**: Follow premium glassmorphic design principles.
- **Error Handling**: Gracefully handle Ollama connection failures.

## Architectural Invariants (ANT Layer)
- **Layer 1 (Core)**: Ollama API interaction.
- **Layer 2 (Logic)**: Prompt engineering and parsing.
- **Layer 3 (UI)**: Vanilla JS / CSS Frontend.
