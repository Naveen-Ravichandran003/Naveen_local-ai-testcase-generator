# SOP: UI State & Interaction Management

## Goal
Ensure the BLAST interface remains responsive, visually consistent, and reliable during AI generation.

## State Definitions
- **IDLE**: Waiting for user input.
- **PROCESSING**: Data sent to Ollama, waiting for response. Show loading micro-animation.
- **ERROR**: API call failed. Show clear error message and recovery steps.
- **DISPLAY**: Rendering generated test cases with Markdown formatting.

## Interaction Rules
- **Enter Key**: Trigger generation (unless Shift is held).
- **Auto-scroll**: Chat area must always scroll to the bottom when new message fragments or full messages arrive.
- **Formatting**: LLM Markdown must be transformed into semantic HTML (`<strong>`, `<code>`, etc.) for readability.

## Navigation Layer (The Glue)
The `main.js` file acts as the Navigation layer, mapping UI events to the Architecture SOPs and the Tool executions.
