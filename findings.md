# Findings - BLAST

## Initial Discovery
- **Ollama Version**: 0.15.1 (Verified)
- **Environment**: Windows
- **Project Goal**: Local test case generation using Ollama (tinyllama).
- **North Star**: One-click local test case generation via chat UI.
- **Integrations**: Ollama API.
- **Payload**: Dynamic UI chat display.
- **Behavioral Rules**: Professional QA-style test generation using a fixed template.

## Constraints
- Must run locally.
- Must follow BLAST protocol and ANT architecture.
- **Environment Constraint**: Python is not available on this system. All "Layer 3" deterministic tools are implemented in **PowerShell**.
- **Hardware Constraint**: Switched to `tinyllama` (~637MB) from `llama3.2` to accommodate 1.8GiB available RAM.
- **CORS Setup**: Required for browser-to-Ollama communication. Set `OLLAMA_ORIGINS="*"` permanently via PowerShell.

## Research
- [x] Ollama API endpoints (/api/generate, /api/chat) - Confirmed available for local LLM interaction.
- [x] Best models - Research suggest llama3, codellama, and mistral as high-performing candidates.
- [x] UI Inspiration - Found examples of single-file "premium" vanilla JS UIs like "Ollama AI Prompt Generator".
- [x] Official SDK - Ollama provides an official JavaScript library for easier integration.
