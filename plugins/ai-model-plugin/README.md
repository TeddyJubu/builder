# AI Models Plugin

A Builder.io plugin that integrates with OpenRouter and Groq APIs to provide AI text generation capabilities with model selection.

## Features

- **Multiple AI Providers**: Support for both OpenRouter and Groq APIs
- **Model Selection**: Choose from various models including GPT-4, Claude 3, Llama 3, Mistral, and more
- **Flexible Configuration**: Configure API keys, default models, temperature, and token limits
- **UI Component**: Built-in text generator component with model selection
- **Validation**: Automatic API key validation on setup

## Setup

1. **Install the plugin** in your Builder.io space
2. **Configure API Keys**:
   - Get your OpenRouter API key from [openrouter.ai](https://openrouter.ai)
   - Get your Groq API key from [console.groq.com](https://console.groq.com)
   - Add at least one API key in the plugin settings

3. **Configure Settings**:
   - Choose your default provider (OpenRouter or Groq)
   - Select a default model
   - Set temperature (0.0-1.0) for creativity control
   - Set max tokens for response length

## Available Models

### OpenRouter Models
- GPT-4, GPT-3.5 Turbo
- Claude 3 (Opus, Sonnet, Haiku)
- Llama 3 70B
- Mistral 7B

### Groq Models (High-speed inference)
- Llama 3 (8B, 70B)
- Mixtral 8x7B
- Gemma 7B

## Usage

### As a Custom Input Type
Use the AI Text Generator as a custom input in your Builder content types:

```json
{
  "name": "generatedContent",
  "type": "aiText",
  "friendlyName": "AI Generated Content"
}
```

### Programmatic Usage
Access the AI generation functions through the plugin API:

```javascript
const aiService = appState.plugins.get('@builder.io/plugin-ai-models');
const result = await aiService.aiText.generate({
  prompt: "Write a product description for...",
  model: "openai/gpt-4",
  maxTokens: 500,
  temperature: 0.7
});
```

## API Reference

### Configuration Options
- `openrouterApiKey`: Your OpenRouter API key
- `groqApiKey`: Your Groq API key  
- `defaultProvider`: 'openrouter' or 'groq'
- `defaultModel`: Default model ID to use
- `maxTokens`: Maximum tokens to generate (default: 1000)
- `temperature`: Creativity control 0.0-1.0 (default: 0.7)

### Methods
- `generateText(options)`: Generate text with specified options
- `validateConfig()`: Validate API key configuration
- `getAvailableModels()`: Get list of supported models

## Error Handling

The plugin includes comprehensive error handling:
- API key validation
- Rate limit handling
- Network error recovery
- User-friendly error messages

## Development

To build the plugin:
```bash
npm install
npm run build
```

To develop with hot reload:
```bash
npm start
```