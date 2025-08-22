# AI Models Plugin - Setup & Usage Guide

## 🚀 Quick Start

### 1. Install the Plugin
In your Builder.io space, navigate to **Account Settings** → **Plugins** → **Install Plugin**
- Use the plugin URL or upload the `dist/plugin.system.js` file

### 2. Configure API Keys
After installation, click **Connect your AI APIs**:

```
OpenRouter API Key: sk-or-v1-... (get from https://openrouter.ai)
Groq API Key: gsk_... (get from https://console.groq.com)
Default Provider: openrouter
Default Model: openai/gpt-3.5-turbo
Max Tokens: 1000
Temperature: 0.7
```

### 3. Use in Content Types
Create a content type with AI-powered fields:

```json
{
  "name": "product",
  "fields": [
    {
      "name": "name",
      "type": "string",
      "required": true
    },
    {
      "name": "description", 
      "type": "aiText",
      "friendlyName": "AI Product Description",
      "helperText": "Generate compelling product descriptions"
    }
  ]
}
```

## 💡 Usage Examples

### Content Creation
When editing content, you'll see an AI Text Generator field:
- **Model Dropdown**: Choose from 11+ models across OpenRouter & Groq
- **Prompt Field**: Enter your generation prompt
- **Generate Button**: Creates text with selected model
- **Edit Field**: Modify generated content as needed

### Example Prompts
- **Product Description**: "Write a compelling description for [product name] highlighting [key features]"
- **Blog Introduction**: "Create an engaging introduction for a blog post about [topic]"
- **Marketing Copy**: "Generate persuasive marketing copy for [product/service] targeting [audience]"

### Model Selection Guide
| Use Case | Recommended Model | Why |
|----------|------------------|-----|
| Creative Writing | `openai/gpt-4` | Best quality & creativity |
| Technical Docs | `anthropic/claude-3-sonnet` | Excellent reasoning |
| Fast Responses | `llama3-8b-8192` (Groq) | High-speed inference |
| Code Generation | `anthropic/claude-3-opus` | Superior technical skills |
| Long Content | `mixtral-8x7b-32768` (Groq) | Large context window |

## 🛠️ Advanced Usage

### Programmatic Access
```javascript
// In a custom Builder component
const aiService = appState.plugins.get('@builder.io/plugin-ai-models');

const result = await aiService.aiText.generate({
  prompt: "Generate a product tagline for an eco-friendly water bottle",
  model: "openai/gpt-4",
  maxTokens: 50,
  temperature: 0.8
});

console.log(result.content); // Generated tagline
```

### Custom Components
```jsx
import { AITextGenerator } from '@builder.io/plugin-ai-models';

const MyComponent = ({ content, updateContent }) => (
  <div>
    <AITextGenerator 
      value={content}
      onChange={updateContent}
      placeholder="Describe your content needs..."
      model="anthropic/claude-3-haiku"
    />
  </div>
);
```

## 🔧 Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `openrouterApiKey` | Your OpenRouter API key | - |
| `groqApiKey` | Your Groq API key | - |
| `defaultProvider` | Preferred API provider | `openrouter` |
| `defaultModel` | Default model for generation | `openai/gpt-3.5-turbo` |
| `maxTokens` | Maximum response length | `1000` |
| `temperature` | Creativity level (0.0-1.0) | `0.7` |

## 🎯 Benefits

✅ **Multi-Provider**: Access both OpenRouter and Groq models
✅ **Model Variety**: 11+ models for different use cases  
✅ **Speed Options**: Groq for fast inference, OpenRouter for quality
✅ **Cost Control**: Configure token limits and temperature
✅ **User-Friendly**: Simple UI with model selection dropdown
✅ **Validation**: Automatic API key validation
✅ **Error Handling**: Clear error messages and recovery

## 🔒 Security

- API keys are stored securely in Builder.io settings
- Requests include proper authentication headers
- Error messages don't expose sensitive information
- CORS-compliant requests to AI providers

## 📊 Model Comparison

### OpenRouter Models
- **GPT-4**: Highest quality, best for complex tasks
- **Claude 3 Opus**: Excellent reasoning and analysis  
- **Claude 3 Sonnet**: Balanced performance and speed
- **Llama 3 70B**: Open-source, good general performance

### Groq Models (High-Speed)
- **Llama 3 8B**: Fast inference, good for simple tasks
- **Llama 3 70B**: Fast + high quality combination
- **Mixtral 8x7B**: Large context, excellent for long content
- **Gemma 7B**: Efficient, good for basic content generation

Start with **GPT-3.5 Turbo** for general use, switch to **GPT-4** for complex content, or use **Groq models** when you need speed!