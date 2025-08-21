# simple_api_generator.py
"""
Simplified API-based Spanish generator for 2000+ vocabulary words
Works with any text generation API (OpenAI, Claude, local models, etc.)
"""

import json
import re
import requests
import time
from typing import Dict, List, Tuple, Set

class SimpleSpanishGenerator:
    def __init__(self, api_config: Dict):
        """
        Initialize with flexible API configuration
        
        api_config example:
        {
            "type": "openai",  # or "claude", "custom"
            "api_key": "your-key",
            "endpoint": "https://api.openai.com/v1/chat/completions",
            "model": "gpt-5-nano-2025-08-07"
        }
        """
        self.api_config = api_config
        
    def call_api(self, prompt: str) -> str:
        """Generic API caller that works with multiple providers"""
        
        if self.api_config["type"] == "openai":
            return self._call_openai(prompt)
        elif self.api_config["type"] == "claude":
            return self._call_claude(prompt)
        elif self.api_config["type"] == "custom":
            return self._call_custom(prompt)
        else:
            raise ValueError(f"Unsupported API type: {self.api_config['type']}")
    
    def _call_openai(self, prompt: str) -> str:
        """Call OpenAI-compatible API"""
        headers = {
            "Authorization": f"Bearer {self.api_config['api_key']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.api_config["model"],
            "messages": [
                {"role": "system", "content": "You are an expert Spanish teacher creating GCSE materials."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
        
        response = requests.post(self.api_config["endpoint"], headers=headers, json=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    
    def _call_claude(self, prompt: str) -> str:
        """Call Claude API"""
        headers = {
            "x-api-key": self.api_config['api_key'],
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        data = {
            "model": self.api_config["model"],
            "max_tokens": 300,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        response = requests.post(self.api_config["endpoint"], headers=headers, json=data)
        response.raise_for_status()
        return response.json()["content"][0]["text"]
    
    def _call_custom(self, prompt: str) -> str:
        """Call custom API endpoint"""
        # Implement based on your specific API requirements
        data = {"prompt": prompt, "max_tokens": 300}
        response = requests.post(self.api_config["endpoint"], json=data)
        response.raise_for_status()
        return response.json()["response"]  # Adjust based on your API response format
    
    def generate_for_vocabulary_batch(self, vocab_batch: List[str], theme: str) -> str:
        """Generate content for a batch of vocabulary words"""
        
        vocab_string = ", ".join([f"**{word}**" for word in vocab_batch])
        
        prompt = f"""
        Create a natural Spanish paragraph for GCSE Year 11 students about "{theme}".
        
        REQUIREMENTS:
        - Include ALL these words in bold: {vocab_string}
        - Use natural, flowing Spanish appropriate for teenagers
        - Make it engaging and realistic
        - 4-6 sentences
        - Each vocabulary word must appear as **word** in the text
        
        Topic: {theme}
        """
        
        try:
            content = self.call_api(prompt)
            return content.strip()
        except Exception as e:
            print(f"API call failed: {e}")
            # Fallback to simple concatenation
            return f"Sobre {theme}: " + " ".join([f"**{word}**" for word in vocab_batch]) + "."
    
    def generate_comprehensive_booklet(self, vocabulary_file: str, themes: List[str]) -> str:
        """Generate complete booklet for large vocabulary set"""
        
        # Load vocabulary
        with open(vocabulary_file, 'r', encoding='utf-8') as f:
            vocabulary = json.load(f)
        
        # Flatten vocabulary into single list
        all_words = []
        for category, word_list in vocabulary.items():
            for word_item in word_list:
                if isinstance(word_item, tuple):
                    all_words.append(word_item[0])
                else:
                    all_words.append(word_item)
        
        print(f"📚 Processing {len(all_words)} vocabulary words across {len(themes)} themes")
        
        # Split vocabulary across themes
        words_per_theme = len(all_words) // len(themes)
        content_blocks = []
        
        for i, theme in enumerate(themes):
            print(f"🎯 Generating content for: {theme}")
            
            # Get words for this theme
            start_idx = i * words_per_theme
            end_idx = start_idx + words_per_theme if i < len(themes) - 1 else len(all_words)
            theme_words = all_words[start_idx:end_idx]
            
            # Split theme words into manageable batches
            batch_size = 12  # Optimal for API context
            theme_paragraphs = []
            
            for j in range(0, len(theme_words), batch_size):
                batch = theme_words[j:j + batch_size]
                print(f"  📝 Generating paragraph {j//batch_size + 1} ({len(batch)} words)")
                
                paragraph = self.generate_for_vocabulary_batch(batch, theme)
                theme_paragraphs.append(paragraph)
                
                # Rate limiting
                time.sleep(1)
            
            # Combine theme paragraphs
            theme_content = "\n\n".join(theme_paragraphs)
            content_blocks.append((theme, theme_content))
        
        # Compile final document
        final_content = self._compile_document(content_blocks, vocabulary, all_words)
        
        return final_content
    
    def _compile_document(self, content_blocks: List[Tuple[str, str]], vocabulary: Dict, all_words: List[str]) -> str:
        """Compile final document with verification"""
        
        content = f"""# 📚 Cuaderno de Revisión GCSE Español - EDICIÓN COMPLETA
## {len(all_words)} Palabras de Vocabulario Integradas

*Generado automáticamente con verificación de cobertura*

---

"""
        
        # Add content sections
        for i, (theme, text) in enumerate(content_blocks, 1):
            content += f"## Tema {i}: {theme}\n\n"
            content += f"{text}\n\n"
            content += "---\n\n"
        
        # Verify coverage and add checklist
        all_text = " ".join([text for _, text in content_blocks])
        used_words = set(re.findall(r'\*\*(.*?)\*\*', all_text))
        
        content += f"## ✅ Verificación de Vocabulario\n\n"
        content += f"**Total de palabras**: {len(all_words)}\n"
        content += f"**Palabras utilizadas**: {len(used_words)}\n"
        content += f"**Cobertura**: {(len(used_words)/len(all_words)*100):.1f}%\n\n"
        
        if len(used_words) == len(all_words):
            content += "🎉 **¡ÉXITO COMPLETO!** Todas las palabras han sido utilizadas.\n\n"
        else:
            missing = set(all_words) - used_words
            content += f"⚠️ Faltan {len(missing)} palabras: {', '.join(list(missing)[:10])}...\n\n"
        
        return content

def create_sample_vocabulary_file():
    """Create a sample vocabulary file for testing"""
    sample_vocab = {
        "adjectives": [
            ("responsable", "responsible"),
            ("trabajador", "hardworking"),
            ("inteligente", "intelligent"),
            # ... expand with your full 2000 words
        ],
        "nouns": [
            ("estudiante", "student"),
            ("profesor", "teacher"),
            ("escuela", "school"),
            # ... continue with all categories
        ],
        # Add all other categories...
    }
    
    with open("comprehensive_vocabulary.json", "w", encoding="utf-8") as f:
        json.dump(sample_vocab, f, ensure_ascii=False, indent=2)
    
    print("📝 Sample vocabulary file created: comprehensive_vocabulary.json")

def main():
    """Example usage"""
    
    # Configuration for your API
    api_config = {
        "type": "openai",  # Change to your preferred API
        "api_key": "your-api-key-here",
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "model": "gpt-5-nano-2025-08-07"
    }
    
    # GCSE themes
    themes = [
        "Identidad personal y familia",
        "Educación y instituto",
        "Tecnología y comunicación",
        "Trabajo y profesiones",
        "Tiempo libre y hobbies",
        "Viajes y cultura",
        "Problemas sociales",
        "Tradiciones y fiestas",
        "Salud y deporte",
        "Futuro y aspiraciones"
    ]
    
    # Create sample vocabulary file if it doesn't exist
    import os
    if not os.path.exists("comprehensive_vocabulary.json"):
        create_sample_vocabulary_file()
    
    # Generate booklet
    generator = SimpleSpanishGenerator(api_config)
    
    print("🚀 Starting generation for comprehensive vocabulary...")
    final_content = generator.generate_comprehensive_booklet("comprehensive_vocabulary.json", themes)
    
    # Save results
    with open("api_generated_spanish_revision.md", "w", encoding="utf-8") as f:
        f.write(final_content)
    
    print("✅ Generation complete! Check api_generated_spanish_revision.md")

if __name__ == "__main__":
    main()
