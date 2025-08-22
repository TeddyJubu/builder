import appState from '@builder.io/app-context';

export interface AIRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: 'openrouter' | 'groq';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// OpenRouter Models
export const OPENROUTER_MODELS = [
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'openrouter' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openrouter' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'openrouter' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'openrouter' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'openrouter' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'openrouter' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'openrouter' }
];

// Groq Models
export const GROQ_MODELS = [
  { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'groq' },
  { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq' },
  { id: 'gemma-7b-it', name: 'Gemma 7B', provider: 'groq' }
];

export const ALL_MODELS = [...OPENROUTER_MODELS, ...GROQ_MODELS];

export class AIApiClient {
  private openrouterApiKey: string;
  private groqApiKey: string;

  constructor(openrouterApiKey: string, groqApiKey: string) {
    this.openrouterApiKey = openrouterApiKey;
    this.groqApiKey = groqApiKey;
  }

  async callOpenRouter(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://builder.io',
        'X-Title': 'Builder.io AI Plugin'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: request.model,
      provider: 'openrouter',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined
    };
  }

  async callGroq(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: request.model,
      provider: 'groq',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined
    };
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    // Determine which API to use based on the model
    const isGroqModel = GROQ_MODELS.some(m => m.id === request.model);
    
    if (isGroqModel) {
      return this.callGroq(request);
    } else {
      return this.callOpenRouter(request);
    }
  }

  async validateConfig(): Promise<void> {
    // Test both APIs with simple requests
    try {
      if (this.openrouterApiKey) {
        await this.callOpenRouter({
          prompt: 'Hello',
          model: 'openai/gpt-3.5-turbo',
          maxTokens: 10
        });
      }

      if (this.groqApiKey) {
        await this.callGroq({
          prompt: 'Hello',
          model: 'llama3-8b-8192',
          maxTokens: 10
        });
      }
    } catch (error) {
      throw new Error(`AI API validation failed: ${error.message}`);
    }
  }
}