#!/usr/bin/env node
/**
 * Example script showing how to use the AI Models plugin
 * This would typically be used in a Builder.io content type or custom component
 */

// Example: Using the plugin in a Builder content type
const exampleContentType = {
  name: 'blog-post',
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true
    },
    {
      name: 'generatedIntro',
      type: 'aiText',
      friendlyName: 'AI Generated Introduction',
      helperText: 'Use AI to generate an engaging blog post introduction'
    },
    {
      name: 'generatedSummary', 
      type: 'aiText',
      friendlyName: 'AI Generated Summary',
      helperText: 'Generate a summary of the blog post content'
    }
  ]
};

// Example: Programmatic usage
async function generateProductDescription(productName, features) {
  // This would be used in a Builder.io application
  const aiService = appState.plugins.get('@builder.io/plugin-ai-models');
  
  const prompt = `Write a compelling product description for "${productName}" with these features: ${features.join(', ')}`;
  
  try {
    const result = await aiService.aiText.generate({
      prompt,
      model: 'openai/gpt-4',
      maxTokens: 300,
      temperature: 0.7
    });
    
    console.log('Generated description:', result.content);
    console.log('Model used:', result.model);
    console.log('Provider:', result.provider);
    
    return result.content;
  } catch (error) {
    console.error('Failed to generate description:', error);
    return null;
  }
}

// Example: Model selection based on use case
function selectOptimalModel(useCase) {
  const modelRecommendations = {
    'creative-writing': 'openai/gpt-4',
    'technical-docs': 'anthropic/claude-3-sonnet',  
    'fast-responses': 'llama3-8b-8192', // Groq for speed
    'code-generation': 'anthropic/claude-3-opus',
    'summarization': 'llama3-70b-8192'
  };
  
  return modelRecommendations[useCase] || 'openai/gpt-3.5-turbo';
}

console.log('AI Models Plugin Example');
console.log('=======================');
console.log('Content Type Example:', JSON.stringify(exampleContentType, null, 2));
console.log('\nRecommended model for creative writing:', selectOptimalModel('creative-writing'));
console.log('Recommended model for fast responses:', selectOptimalModel('fast-responses'));