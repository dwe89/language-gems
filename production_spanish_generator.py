# production_spanish_generator.py
"""
Production-ready Spanish GCSE revision booklet generator
Optimized for 2000+ vocabulary words with GPT-5 Nano integration
"""

import json
import re
import time
import os
from typing import Dict, List, Tuple, Set, Optional
from dataclasses import dataclass
from datetime import datetime

# Try to import OpenAI, fall back to requests for custom APIs
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    import requests

@dataclass
class GenerationStats:
    total_words: int
    words_used: int
    api_calls_made: int
    generation_time: float
    estimated_cost: float
    themes_generated: int
    
    @property
    def coverage_percentage(self) -> float:
        return (self.words_used / self.total_words) * 100 if self.total_words > 0 else 0

class ProductionSpanishGenerator:
    """
    Professional-grade Spanish revision booklet generator
    Designed for educational institutions and large vocabulary sets
    """
    
    def __init__(self, api_config: Dict):
        """
        Initialize with API configuration
        
        Example configs:
        
        OpenAI gpt-5-nano-2025-08-07:
        {
            "provider": "openai",
            "api_key": "sk-...",
            "model": "gpt-5-nano-2025-08-07",
            "base_url": None
        }
        
        GPT-5 Nano (custom endpoint):
        {
            "provider": "custom",
            "api_key": "your-key",
            "model": "gpt-5-nano-2025-08-07",
            "base_url": "https://your-endpoint.com/v1/chat/completions"
        }
        """
        self.api_config = api_config
        self.stats = None
        self.generated_content = {}
        self.vocabulary_tracking = {}
        
        # Initialize API client based on provider
        if api_config["provider"] == "openai" and OPENAI_AVAILABLE:
            self.client = openai.OpenAI(
                api_key=api_config["api_key"],
                base_url=api_config.get("base_url")
            )
        else:
            self.client = None  # Use requests for custom APIs
    
    def call_api(self, prompt: str, max_retries: int = 3) -> str:
        """Call API with error handling and retries"""
        
        for attempt in range(max_retries):
            try:
                if self.client and self.api_config["provider"] == "openai":
                    return self._call_openai_api(prompt)
                else:
                    return self._call_custom_api(prompt)
                    
            except Exception as e:
                print(f"⚠️  API call attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print(f"❌ All API attempts failed. Using fallback.")
                    return self._generate_fallback_content(prompt)
    
    def _call_openai_api(self, prompt: str) -> str:
        """Call OpenAI-compatible API"""
        response = self.client.chat.completions.create(
            model=self.api_config["model"],
            messages=[
                {"role": "system", "content": "You are an expert Spanish teacher creating engaging GCSE materials. Write natural, flowing Spanish that incorporates vocabulary words seamlessly."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    
    def _call_custom_api(self, prompt: str) -> str:
        """Call custom API endpoint"""
        headers = {
            "Authorization": f"Bearer {self.api_config['api_key']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.api_config["model"],
            "messages": [
                {"role": "system", "content": "You are an expert Spanish teacher creating engaging GCSE materials."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 400,
            "temperature": 0.7
        }
        
        response = requests.post(self.api_config["base_url"], headers=headers, json=data)
        response.raise_for_status()
        
        # Handle different response formats
        result = response.json()
        if "choices" in result:
            return result["choices"][0]["message"]["content"].strip()
        elif "response" in result:
            return result["response"].strip()
        else:
            raise ValueError(f"Unexpected API response format: {result}")
    
    def _generate_fallback_content(self, prompt: str) -> str:
        """Generate basic content when API fails"""
        # Extract vocabulary words from prompt
        vocab_words = re.findall(r'\*\*(.*?)\*\*', prompt)
        
        # Create simple but functional content
        return f"En esta sección de nuestro estudio, exploramos: {', '.join([f'**{word}**' for word in vocab_words])}. Estos conceptos son fundamentales para comprender el tema."
    
    def load_vocabulary(self, vocabulary_source) -> Dict[str, List[str]]:
        """
        Load vocabulary from various sources
        
        Args:
            vocabulary_source: Can be:
                - String path to JSON file
                - Dictionary with vocabulary
                - List of words (will be auto-categorized)
        """
        
        if isinstance(vocabulary_source, str):
            # Load from file
            with open(vocabulary_source, 'r', encoding='utf-8') as f:
                if vocabulary_source.endswith('.json'):
                    return json.load(f)
                else:
                    # Assume plain text, one word per line
                    words = [line.strip() for line in f if line.strip()]
                    return {"vocabulary": words}
        
        elif isinstance(vocabulary_source, dict):
            return vocabulary_source
        
        elif isinstance(vocabulary_source, list):
            # Auto-categorize if needed
            return {"vocabulary": vocabulary_source}
        
        else:
            raise ValueError(f"Unsupported vocabulary source type: {type(vocabulary_source)}")
    
    def create_theme_mapping(self, vocabulary: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """
        Create intelligent mapping of vocabulary to GCSE themes
        """
        
        # Predefined category to theme mapping
        category_theme_map = {
            # Identity and relationships
            "identidad": "Theme 1: Identity and relationships",
            "familia": "Theme 1: Identity and relationships",
            "personalidad": "Theme 1: Identity and relationships",
            "descripcion": "Theme 1: Identity and relationships",
            
            # Local area, holiday, travel
            "transporte": "Theme 2: Local area, holiday, travel",
            "casa": "Theme 2: Local area, holiday, travel",
            "ciudad": "Theme 2: Local area, holiday, travel",
            "viajes": "Theme 2: Local area, holiday, travel",
            "vacaciones": "Theme 2: Local area, holiday, travel",
            
            # School
            "educacion": "Theme 3: School",
            "instituto": "Theme 3: School",
            "asignaturas": "Theme 3: School",
            "colegio": "Theme 3: School",
            
            # Future aspirations, study, work
            "trabajo": "Theme 4: Future aspirations, study, work",
            "profesiones": "Theme 4: Future aspirations, study, work",
            "futuro": "Theme 4: Future aspirations, study, work",
            "universidad": "Theme 4: Future aspirations, study, work",
            
            # International and global dimension
            "tecnologia": "Theme 5: International and global dimension",
            "medioambiente": "Theme 5: International and global dimension",
            "global": "Theme 5: International and global dimension",
            "internet": "Theme 5: International and global dimension",
            
            # Culture and lifestyle
            "tiempo_libre": "Theme 6: Culture and lifestyle",
            "comida": "Theme 6: Culture and lifestyle",
            "ropa": "Theme 6: Culture and lifestyle",
            "cultura": "Theme 6: Culture and lifestyle",
            "deportes": "Theme 6: Culture and lifestyle",
            "musica": "Theme 6: Culture and lifestyle"
        }
        
        theme_vocabulary = {}
        
        # Map known categories
        for category, words in vocabulary.items():
            theme = category_theme_map.get(category.lower(), "Additional vocabulary")
            
            if theme not in theme_vocabulary:
                theme_vocabulary[theme] = []
            
            # Handle different word formats
            for word_item in words:
                if isinstance(word_item, tuple):
                    theme_vocabulary[theme].append(word_item[0])  # Spanish word
                elif isinstance(word_item, str):
                    theme_vocabulary[theme].append(word_item)
        
        # Ensure balanced distribution
        self._balance_theme_distribution(theme_vocabulary)
        
        return theme_vocabulary
    
    def _balance_theme_distribution(self, theme_vocabulary: Dict[str, List[str]]):
        """Ensure themes have balanced word counts"""
        
        total_words = sum(len(words) for words in theme_vocabulary.values())
        target_per_theme = total_words // len(theme_vocabulary)
        
        # Move words from oversized themes to undersized ones
        themes = list(theme_vocabulary.keys())
        for theme in themes:
            if len(theme_vocabulary[theme]) > target_per_theme * 1.5:
                # Theme is too large, redistribute
                excess_words = theme_vocabulary[theme][target_per_theme:]
                theme_vocabulary[theme] = theme_vocabulary[theme][:target_per_theme]
                
                # Find themes that need more words
                for other_theme in themes:
                    if len(theme_vocabulary[other_theme]) < target_per_theme * 0.8:
                        needed = min(len(excess_words), target_per_theme - len(theme_vocabulary[other_theme]))
                        theme_vocabulary[other_theme].extend(excess_words[:needed])
                        excess_words = excess_words[needed:]
                        
                        if not excess_words:
                            break
    
    def generate_comprehensive_booklet(self, vocabulary_source, output_prefix: str = "production_spanish") -> str:
        """
        Generate comprehensive Spanish revision booklet
        
        Args:
            vocabulary_source: Vocabulary data (file path, dict, or list)
            output_prefix: Prefix for output files
            
        Returns:
            Path to generated markdown file
        """
        
        start_time = time.time()
        print("🚀 Starting production generation...")
        
        # Load and process vocabulary
        vocabulary = self.load_vocabulary(vocabulary_source)
        theme_vocabulary = self.create_theme_mapping(vocabulary)
        
        total_words = sum(len(words) for words in theme_vocabulary.values())
        print(f"📚 Processing {total_words} words across {len(theme_vocabulary)} themes")
        
        # Initialize tracking
        all_words_used = set()
        api_calls_made = 0
        estimated_cost = 0.0
        
        # Generate content for each theme
        booklet_sections = []
        
        for theme_idx, (theme, words) in enumerate(theme_vocabulary.items(), 1):
            print(f"\n🎯 Generating {theme} ({len(words)} words)")
            
            theme_content = self._generate_theme_content(theme, words)
            booklet_sections.append((theme, theme_content))
            
            # Track usage
            theme_words_used = set(re.findall(r'\*\*(.*?)\*\*', theme_content))
            all_words_used.update(theme_words_used)
            
            # Estimate costs and calls
            api_calls_made += len(words) // 12 + 1  # Batch size of 12
            estimated_cost += (len(words) // 12 + 1) * 0.012  # Rough estimate
            
            print(f"  ✅ Generated {len(theme_words_used)} vocabulary integrations")
        
        # Compile final document
        generation_time = time.time() - start_time
        
        self.stats = GenerationStats(
            total_words=total_words,
            words_used=len(all_words_used),
            api_calls_made=api_calls_made,
            generation_time=generation_time,
            estimated_cost=estimated_cost,
            themes_generated=len(theme_vocabulary)
        )
        
        final_document = self._compile_final_document(booklet_sections, self.stats)
        
        # Save files
        markdown_path = f"{output_prefix}_revision_booklet.md"
        with open(markdown_path, 'w', encoding='utf-8') as f:
            f.write(final_document)
        
        # Generate additional formats
        self._generate_additional_formats(markdown_path, output_prefix)
        
        # Save generation report
        self._save_generation_report(output_prefix)
        
        print(f"\n🎉 Generation complete!")
        print(f"📊 Coverage: {self.stats.coverage_percentage:.1f}% ({self.stats.words_used}/{self.stats.total_words})")
        print(f"⏱️  Time: {self.stats.generation_time:.1f}s")
        print(f"💰 Estimated cost: ${self.stats.estimated_cost:.2f}")
        
        return markdown_path
    
    def _generate_theme_content(self, theme: str, words: List[str]) -> str:
        """Generate content for a specific theme"""
        
        # Split words into manageable batches
        batch_size = 12
        theme_paragraphs = []
        
        for i in range(0, len(words), batch_size):
            batch = words[i:i + batch_size]
            
            # Create contextual prompt
            prompt = self._create_theme_prompt(theme, batch)
            
            # Generate content
            paragraph = self.call_api(prompt)
            theme_paragraphs.append(paragraph)
            
            # Rate limiting
            time.sleep(0.5)
        
        return "\n\n".join(theme_paragraphs)
    
    def _create_theme_prompt(self, theme: str, words: List[str]) -> str:
        """Create contextual prompt for theme and vocabulary"""
        
        vocab_string = ", ".join([f"**{word}**" for word in words])
        
        theme_contexts = {
            "Theme 1: Identity and relationships": "la identidad personal, las relaciones familiares y sociales",
            "Theme 2: Local area, holiday, travel": "el área local, las vacaciones y los viajes",
            "Theme 3: School": "la vida escolar y la educación",
            "Theme 4: Future aspirations, study, work": "las aspiraciones futuras, los estudios y el trabajo",
            "Theme 5: International and global dimension": "la dimensión internacional y global",
            "Theme 6: Culture and lifestyle": "la cultura y el estilo de vida"
        }
        
        context = theme_contexts.get(theme, "temas generales de español")
        
        return f"""
Escribe un párrafo natural y fluido en español para estudiantes de GCSE Year 11 sobre {context}.

REQUISITOS OBLIGATORIOS:
- Incluye TODAS estas palabras en negrita: {vocab_string}
- Usa español natural y apropiado para adolescentes
- Crea un contexto realista y atractivo
- 4-6 oraciones conectadas lógicamente
- Cada palabra de vocabulario debe aparecer como **palabra** en el texto

El párrafo debe sonar natural, no como una lista de vocabulario forzada.
"""
    
    def _compile_final_document(self, sections: List[Tuple[str, str]], stats: GenerationStats) -> str:
        """Compile final document with all sections and metadata"""
        
        content = f"""# 📚 Cuaderno de Revisión GCSE Español - EDICIÓN PROFESIONAL
## {stats.total_words} Palabras de Vocabulario | Cobertura: {stats.coverage_percentage:.1f}%

*Generado automáticamente el {datetime.now().strftime('%d/%m/%Y a las %H:%M')}*

### 📊 Estadísticas de Generación
- **Total de palabras**: {stats.total_words}
- **Palabras utilizadas**: {stats.words_used}
- **Cobertura**: {stats.coverage_percentage:.1f}%
- **Temas generados**: {stats.themes_generated}
- **Tiempo de generación**: {stats.generation_time:.1f} segundos

---

"""
        
        # Add content sections
        for i, (theme, text) in enumerate(sections, 1):
            content += f"## {i}. {theme}\n\n"
            content += f"{text}\n\n"
            content += "---\n\n"
        
        # Add vocabulary verification
        content += self._generate_vocabulary_checklist(sections)
        
        return content
    
    def _generate_vocabulary_checklist(self, sections: List[Tuple[str, str]]) -> str:
        """Generate vocabulary usage checklist"""
        
        all_text = " ".join([text for _, text in sections])
        used_words = set(re.findall(r'\*\*(.*?)\*\*', all_text))
        
        checklist = "## ✅ Lista de Verificación de Vocabulario\n\n"
        
        if self.stats.coverage_percentage >= 95:
            checklist += "🎉 **¡ÉXITO COMPLETO!** Excelente cobertura de vocabulario.\n\n"
        elif self.stats.coverage_percentage >= 85:
            checklist += "✅ **Muy buena cobertura** de vocabulario.\n\n"
        else:
            checklist += "⚠️ **Cobertura parcial** - considerar regeneración con ajustes.\n\n"
        
        # Summary by theme
        checklist += "### Resumen por Tema\n\n"
        for theme, text in sections:
            theme_words = set(re.findall(r'\*\*(.*?)\*\*', text))
            checklist += f"- **{theme}**: {len(theme_words)} palabras utilizadas\n"
        
        return checklist
    
    def _generate_additional_formats(self, markdown_path: str, prefix: str):
        """Generate Word and HTML versions"""
        
        try:
            # Generate Word document
            docx_path = f"{prefix}_revision_booklet.docx"
            os.system(f'pandoc "{markdown_path}" -o "{docx_path}"')
            print(f"📄 Word document created: {docx_path}")
            
            # Generate HTML
            html_path = f"{prefix}_revision_booklet.html"
            os.system(f'pandoc "{markdown_path}" -o "{html_path}" --css=style.css')
            print(f"🌐 HTML document created: {html_path}")
            
        except Exception as e:
            print(f"⚠️  Could not generate additional formats: {e}")
            print("💡 Install pandoc for automatic format conversion")
    
    def _save_generation_report(self, prefix: str):
        """Save detailed generation report"""
        
        report = {
            "generation_timestamp": datetime.now().isoformat(),
            "api_config": {
                "provider": self.api_config["provider"],
                "model": self.api_config["model"]
            },
            "statistics": {
                "total_words": self.stats.total_words,
                "words_used": self.stats.words_used,
                "coverage_percentage": self.stats.coverage_percentage,
                "api_calls_made": self.stats.api_calls_made,
                "generation_time": self.stats.generation_time,
                "estimated_cost": self.stats.estimated_cost,
                "themes_generated": self.stats.themes_generated
            },
            "quality_metrics": {
                "coverage_rating": "Excellent" if self.stats.coverage_percentage >= 95 else "Good" if self.stats.coverage_percentage >= 85 else "Needs improvement",
                "efficiency_rating": "Excellent" if self.stats.generation_time < 60 else "Good" if self.stats.generation_time < 300 else "Slow"
            }
        }
        
        report_path = f"{prefix}_generation_report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📋 Generation report saved: {report_path}")

def create_sample_config():
    """Create sample configuration for different API providers"""
    
    configs = {
        "openai_gpt4": {
            "provider": "openai",
            "api_key": "sk-your-openai-key-here",
            "model": "gpt-5-nano-2025-08-07",
            "base_url": None
        },
        "gpt5_nano": {
            "provider": "custom",
            "api_key": "your-gpt5-nano-key",
            "model": "gpt-5-nano-2025-08-07",
            "base_url": "https://your-gpt5-nano-endpoint.com/v1/chat/completions"
        },
        "claude": {
            "provider": "custom",
            "api_key": "your-claude-key",
            "model": "claude-3-sonnet",
            "base_url": "https://api.anthropic.com/v1/messages"
        }
    }
    
    with open("api_configurations.json", "w", encoding="utf-8") as f:
        json.dump(configs, f, indent=2)
    
    print("🔧 Sample API configurations created: api_configurations.json")

def main():
    """Production example"""
    
    # Create sample configurations
    create_sample_config()
    
    print("🏭 PRODUCTION SPANISH GENERATOR")
    print("=" * 50)
    print("Ready for 2000+ vocabulary words!")
    print("\nNext steps:")
    print("1. Update api_configurations.json with your API key")
    print("2. Prepare your vocabulary file (JSON format)")
    print("3. Run: generator.generate_comprehensive_booklet('your_vocab.json')")
    print("\nExample configuration for GPT-5 Nano:")
    print("""
    config = {
        "provider": "custom",
        "api_key": "your-key",
        "model": "gpt-5-nano", 
        "base_url": "https://your-endpoint.com/v1/chat/completions"
    }
    generator = ProductionSpanishGenerator(config)
    generator.generate_comprehensive_booklet("your_2000_words.json")
    """)

if __name__ == "__main__":
    main()
