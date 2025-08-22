import React, { useState } from 'react';
import { BuilderPluginProps } from '@builder.io/plugin-tools';
import { ALL_MODELS } from './api';
import appState from '@builder.io/app-context';

interface AITextGeneratorProps extends BuilderPluginProps<string> {
  placeholder?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export const AITextGenerator: React.FC<AITextGeneratorProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter your prompt...',
  model,
  maxTokens,
  temperature
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(model || 'openai/gpt-3.5-turbo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pluginSettings = appState.user.organization.value.settings.plugins?.get('@builder.io/plugin-ai-models');
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Access the plugin's AI generation function
      const aiService = appState.plugins.get('@builder.io/plugin-ai-models');
      if (!aiService?.aiText?.generate) {
        throw new Error('AI service not available. Please configure the AI Models plugin.');
      }

      const result = await aiService.aiText.generate({
        prompt,
        model: selectedModel,
        maxTokens: maxTokens || pluginSettings?.get('maxTokens') || 1000,
        temperature: temperature || pluginSettings?.get('temperature') || 0.7
      });

      onChange?.(result.content);
      setPrompt(''); // Clear prompt after successful generation
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!pluginSettings) {
    return (
      <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <p>Please configure the AI Models plugin first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          AI Model:
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          {ALL_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
          opacity: isGenerating || !prompt.trim() ? 0.6 : 1
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Text'}
      </button>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {value && (
        <div style={{ marginTop: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Generated Text:
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AITextGenerator;