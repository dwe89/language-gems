# example_usage.py
"""
Simple example showing how to use the production Spanish generator
for 2000+ vocabulary words with your GPT-5 Nano API
"""

from production_spanish_generator import ProductionSpanishGenerator
import json

def create_sample_2000_vocabulary():
    """Create a sample vocabulary file with 2000+ words"""
    
    # This would be your actual 2000 words organized by category
    sample_vocab = {
        "identidad_personal": [
            "responsable", "trabajador", "inteligente", "divertido", "amable",
            "generoso", "tímido", "extrovertido", "simpático", "antipático",
            # ... your actual words here
        ],
        "familia_relaciones": [
            "padre", "madre", "hermano", "hermana", "abuelo", "abuela",
            "tío", "tía", "primo", "prima", "sobrino", "sobrina",
            # ... your actual words here
        ],
        "educacion_instituto": [
            "instituto", "colegio", "universidad", "clase", "aula",
            "profesor", "estudiante", "alumno", "director", "secretario",
            # ... your actual words here
        ],
        # Add all your other categories...
        # "trabajo_profesiones": [...],
        # "tiempo_libre_hobbies": [...],
        # "tecnologia_comunicacion": [...],
        # etc.
    }
    
    # For demo purposes, let's expand to show structure
    # In practice, you'd load your real 2000 words here
    
    with open("my_2000_spanish_words.json", "w", encoding="utf-8") as f:
        json.dump(sample_vocab, f, ensure_ascii=False, indent=2)
    
    print("📝 Sample vocabulary file created: my_2000_spanish_words.json")
    print("💡 Replace with your actual 2000 vocabulary words")

def generate_with_gpt5_nano():
    """Example using GPT-5 Nano API"""
    
    # Your GPT-5 Nano configuration
    config = {
        "provider": "custom",
        "api_key": "your-gpt5-nano-api-key-here",  # Replace with your actual key
        "model": "gpt-5-nano",
        "base_url": "https://your-gpt5-nano-endpoint.com/v1/chat/completions"  # Replace with your endpoint
    }
    
    # Initialize generator
    generator = ProductionSpanishGenerator(config)
    
    # Generate comprehensive booklet
    print("🚀 Starting generation with GPT-5 Nano...")
    
    try:
        markdown_file = generator.generate_comprehensive_booklet(
            vocabulary_source="my_2000_spanish_words.json",
            output_prefix="gpt5_nano_spanish"
        )
        
        print(f"✅ Success! Generated files:")
        print(f"  📄 Markdown: {markdown_file}")
        print(f"  📄 Word: gpt5_nano_spanish_revision_booklet.docx")
        print(f"  🌐 HTML: gpt5_nano_spanish_revision_booklet.html")
        print(f"  📊 Report: gpt5_nano_spanish_generation_report.json")
        
        # Print statistics
        stats = generator.stats
        print(f"\n📊 Generation Statistics:")
        print(f"  Words processed: {stats.total_words}")
        print(f"  Coverage: {stats.coverage_percentage:.1f}%")
        print(f"  Generation time: {stats.generation_time:.1f}s")
        print(f"  Estimated cost: ${stats.estimated_cost:.2f}")
        
    except Exception as e:
        print(f"❌ Generation failed: {e}")
        print("💡 Check your API configuration and vocabulary file")

def generate_with_openai():
    """Example using OpenAI GPT-4"""
    
    config = {
        "provider": "openai",
        "api_key": "sk-your-openai-key-here",  # Replace with your actual key
        "model": "gpt-4",
        "base_url": None
    }
    
    generator = ProductionSpanishGenerator(config)
    
    markdown_file = generator.generate_comprehensive_booklet(
        vocabulary_source="my_2000_spanish_words.json",
        output_prefix="openai_gpt4_spanish"
    )
    
    print(f"✅ OpenAI generation complete: {markdown_file}")

def quick_test_with_small_vocabulary():
    """Quick test with a small vocabulary set"""
    
    # Create small test vocabulary
    test_vocab = {
        "identidad": ["alto", "bajo", "simpático", "inteligente", "trabajador"],
        "familia": ["padre", "madre", "hermano", "abuelo", "tía"]
    }
    
    with open("test_vocab.json", "w", encoding="utf-8") as f:
        json.dump(test_vocab, f, ensure_ascii=False, indent=2)
    
    # Test configuration (replace with your actual API details)
    config = {
        "provider": "custom",  # or "openai"
        "api_key": "test-key",
        "model": "gpt-5-nano",  # or "gpt-4"
        "base_url": "https://your-endpoint.com/v1/chat/completions"
    }
    
    generator = ProductionSpanishGenerator(config)
    
    try:
        result = generator.generate_comprehensive_booklet(
            vocabulary_source="test_vocab.json",
            output_prefix="test_spanish"
        )
        print(f"✅ Test generation successful: {result}")
    except Exception as e:
        print(f"⚠️  Test generation failed (expected without real API): {e}")

def main():
    """Main example function"""
    
    print("🎯 SPANISH GENERATOR - USAGE EXAMPLES")
    print("=" * 50)
    
    # Step 1: Create sample vocabulary
    print("Step 1: Creating sample vocabulary file...")
    create_sample_2000_vocabulary()
    
    print("\nStep 2: Choose your generation method:")
    print("Option A - GPT-5 Nano (recommended for 2000+ words):")
    print("  generate_with_gpt5_nano()")
    print("\nOption B - OpenAI GPT-4:")
    print("  generate_with_openai()")
    print("\nOption C - Quick test:")
    print("  quick_test_with_small_vocabulary()")
    
    print("\n💡 IMPORTANT:")
    print("1. Replace API keys with your actual keys")
    print("2. Update endpoints with your actual URLs")
    print("3. Load your real 2000 vocabulary words")
    
    print("\n🚀 FOR IMMEDIATE USE:")
    print("1. Edit the config in generate_with_gpt5_nano()")
    print("2. Add your 2000 words to my_2000_spanish_words.json")
    print("3. Run: python3 example_usage.py")

if __name__ == "__main__":
    main()
