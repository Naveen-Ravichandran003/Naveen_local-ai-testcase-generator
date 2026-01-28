# SOP: Local Test Case Generation Logic

## Goal
Generate deterministic, high-quality software test cases using the local Ollama API (llama3.2) based on user-provided feature descriptions or code snippets.

## Inputs
- `userInput`: String containing the feature requirement or source code.
- `model`: `llama3.2:3b` (Default).
- `template`: Structured QA template defined in `main.js`.

## Tool Logic (The Navigational Flow)
1.  **Sanitization**: Clean user input (remove trailing whitespace, handle empty inputs).
2.  **Prompt Construction**: Wrap input with the `SYSTEM_PROMPT` to enforce the QA persona and template consistency.
3.  **API Call**: Send a POST request to `http://localhost:11434/api/generate`.
4.  **Parsing/Formatting**: Safely parse the JSON response and convert Markdown into UI-ready HTML.
5.  **State Management**: Update the chat UI and scroll to the latest result.

## Edge Cases & Fail-safes
- **Ollama Offline**: UI must detect a failed fetch and display a "Connection Error" with instructions to start Ollama.
- **Model Missing**: If `llama3.2:3b` is not found, warn the user and suggest pulling the model.
- **Malformed Output**: If the LLM drifts from the template, ensure the UI still renders the raw text gracefully.
- **Empty Responses**: Handle null or empty `response` strings from the API.

## Behavioral Rules
- Never use external cloud APIs.
- Always follow the `TC-XXX` naming convention.
- Summary section must be present in every response.
