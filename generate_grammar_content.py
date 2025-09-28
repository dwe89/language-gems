#!/usr/bin/env python3
"""
Script to generate Spanish grammar content for the CSV file.
This replaces placeholder content with real Spanish grammar exercises.
"""

import csv
import random

# Define the topics and their content generators
TOPICS = {
    'comparison': {
        'title': 'Comparison',
        'category': 'adjectives',
        'practice_exercises': [
            # Fill blank exercises
            {
                'type': 'fill_blank',
                'instruction': 'Complete the comparative form',
                'sentence': 'Mi coche es _____ (rápido) que el tuyo.',
                'answer': 'más rápido',
                'explanation': 'Use "más + adjective" for comparative: más rápido means "faster"'
            },
            {
                'type': 'fill_blank',
                'instruction': 'Complete the superlative form',
                'sentence': 'Este es el libro _____ (interesante) de la biblioteca.',
                'answer': 'más interesante',
                'explanation': 'Use "el/la/los/las + más + adjective" for superlative'
            },
            # Add more exercises...
        ],
        'quiz_questions': [
            {
                'difficulty': 'beginner',
                'question': 'How do you say "bigger" in Spanish?',
                'correct': 'más grande',
                'options': 'más grande|grande|grandísimo|grandes',
                'explanation': 'Use "más + adjective" for comparative forms'
            },
            # Add more questions...
        ]
    }
    # Add more topics...
}

def generate_comparison_practice():
    """Generate practice exercises for comparison topic"""
    exercises = []
    
    # Fill blank exercises
    fill_blanks = [
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Mi coche es _____ (rápido) que el tuyo.',
            'answer': 'más rápido',
            'explanation': 'Use "más + adjective" for comparative: más rápido means "faster"'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Esta casa es _____ (pequeño) que la otra.',
            'answer': 'más pequeña',
            'explanation': 'Adjectives agree with the noun: casa is feminine so más pequeña'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the superlative form',
            'sentence': 'Este es el libro _____ (interesante) de la biblioteca.',
            'answer': 'más interesante',
            'explanation': 'Use "el/la/los/las + más + adjective" for superlative'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Los elefantes son _____ (grande) que los ratones.',
            'answer': 'más grandes',
            'explanation': 'Plural adjectives add -s: más grandes'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Mi hermana es _____ (joven) que yo.',
            'answer': 'más joven',
            'explanation': 'Regular comparative formation with más + adjective'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the irregular comparative',
            'sentence': 'Este problema es _____ (malo) que el anterior.',
            'answer': 'peor',
            'explanation': 'Irregular comparative: malo → peor (worse)'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the irregular comparative',
            'sentence': 'Mi casa es _____ (bueno) que la tuya.',
            'answer': 'mejor',
            'explanation': 'Irregular comparative: bueno → mejor (better)'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the irregular superlative',
            'sentence': 'Este es el _____ (malo) día de mi vida.',
            'answer': 'peor',
            'explanation': 'Irregular superlative: malo → peor (worst)'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'El café está _____ (caliente) que el té.',
            'answer': 'más caliente',
            'explanation': 'Regular comparative: más + adjective'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the superlative form',
            'sentence': 'Esta es la _____ (hermosa) ciudad que he visto.',
            'answer': 'más hermosa',
            'explanation': 'Superlative with más + adjective (feminine agreement)'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Los niños son _____ (alto) que las niñas.',
            'answer': 'más altos',
            'explanation': 'Plural masculine adjectives: más altos'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the irregular comparative',
            'sentence': 'Este ejercicio es _____ (fácil) que el anterior.',
            'answer': 'más fácil',
            'explanation': 'Regular comparative (fácil is regular)'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the superlative form',
            'sentence': 'Madrid es la _____ (grande) ciudad de España.',
            'answer': 'más grande',
            'explanation': 'Superlative: la más + adjective'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Mi perro es _____ (viejo) que el tuyo.',
            'answer': 'mayor',
            'explanation': 'Irregular comparative for age: viejo → mayor'
        },
        {
            'type': 'fill_blank',
            'instruction': 'Complete the comparative form',
            'sentence': 'Esta película es _____ (bueno) que la otra.',
            'answer': 'mejor',
            'explanation': 'Irregular comparative: bueno → mejor'
        }
    ]
    
    # Multiple choice exercises
    multiple_choice = [
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct comparative form',
            'sentence': 'Mi coche es _____ que el tuyo.',
            'answer': 'más rápido',
            'options': ['más rápido', 'rápido', 'rapidísimo', 'muy rápido'],
            'explanation': 'Use "más + adjective" for comparative forms'
        },
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct superlative form',
            'sentence': 'Esta es la _____ película del año.',
            'answer': 'mejor',
            'options': ['mejor', 'más buena', 'buenísima', 'más mejor'],
            'explanation': 'Irregular superlative: bueno → mejor (best)'
        },
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct comparative form',
            'sentence': 'Los gatos son _____ que los perros.',
            'answer': 'más pequeños',
            'options': ['más pequeños', 'más pequeña', 'pequeño', 'pequeños'],
            'explanation': 'Adjective agrees with plural noun: más pequeños'
        },
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct comparative form',
            'sentence': 'Esta sopa está _____ que la anterior.',
            'answer': 'más caliente',
            'options': ['más caliente', 'calentísima', 'muy caliente', 'caliente'],
            'explanation': 'Regular comparative: más + adjective'
        },
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct superlative form',
            'sentence': 'Barcelona es la _____ ciudad de España.',
            'answer': 'más bonita',
            'options': ['más bonita', 'bonitísima', 'muy bonita', 'bonita'],
            'explanation': 'Superlative with más + adjective (feminine)'
        },
        {
            'type': 'multiple_choice',
            'instruction': 'Choose the correct irregular comparative',
            'sentence': 'Este restaurante es _____ que el otro.',
            'answer': 'mejor',
            'options': ['mejor', 'más bueno', 'buenísimo', 'más mejor'],
            'explanation': 'Irregular comparative: bueno → mejor'
        }
    ]
    
    # Translation exercises
    translations = [
        {
            'type': 'translation',
            'instruction': 'Translate to Spanish',
            'sentence': 'My car is faster than yours.',
            'answer': 'Mi coche es más rápido que el tuyo.',
            'explanation': 'Comparative: más + adjective + que'
        },
        {
            'type': 'translation',
            'instruction': 'Translate to Spanish',
            'sentence': 'This is the best book.',
            'answer': 'Este es el mejor libro.',
            'explanation': 'Superlative: el/la + irregular form'
        },
        {
            'type': 'translation',
            'instruction': 'Translate to Spanish',
            'sentence': 'She is taller than her brother.',
            'answer': 'Ella es más alta que su hermano.',
            'explanation': 'Comparative with adjective agreement'
        },
        {
            'type': 'translation',
            'instruction': 'Translate to Spanish',
            'sentence': 'This is the worst day.',
            'answer': 'Este es el peor día.',
            'explanation': 'Irregular superlative: malo → peor'
        },
        {
            'type': 'translation',
            'instruction': 'Translate to Spanish',
            'sentence': 'My house is bigger than yours.',
            'answer': 'Mi casa es más grande que la tuya.',
            'explanation': 'Regular comparative for size'
        }
    ]
    
    # Transformation exercises
    transformations = [
        {
            'type': 'transformation',
            'instruction': 'Change to comparative form',
            'sentence': 'El coche es rápido → El coche es _____ que el otro.',
            'answer': 'más rápido',
            'explanation': 'Add "más" and "que" for comparative'
        },
        {
            'type': 'transformation',
            'instruction': 'Change to superlative form',
            'sentence': 'La casa es grande → La casa es _____ del barrio.',
            'answer': 'la más grande',
            'explanation': 'Add definite article + más for superlative'
        },
        {
            'type': 'transformation',
            'instruction': 'Change to irregular comparative',
            'sentence': 'El libro es bueno → El libro es _____ que el otro.',
            'answer': 'mejor',
            'explanation': 'Irregular form: bueno → mejor'
        }
    ]
    
    # Substitution exercises
    substitutions = [
        {
            'type': 'substitution',
            'instruction': 'Replace the adjective with its comparative',
            'sentence': 'El libro es interesante (más).',
            'answer': 'El libro es más interesante.',
            'explanation': 'Add "más" before the adjective'
        },
        {
            'type': 'substitution',
            'instruction': 'Replace with irregular comparative',
            'sentence': 'La comida es mala (peor).',
            'answer': 'La comida es peor.',
            'explanation': 'Use irregular form: malo → peor'
        },
        {
            'type': 'substitution',
            'instruction': 'Replace with superlative form',
            'sentence': 'Este restaurante es bueno (el mejor).',
            'answer': 'Este restaurante es el mejor.',
            'explanation': 'Use irregular superlative: bueno → mejor'
        }
    ]
    
    exercises.extend(fill_blanks)
    exercises.extend(multiple_choice)
    exercises.extend(translations)
    exercises.extend(transformations)
    exercises.extend(substitutions)
    
    return exercises

def generate_comparison_quiz():
    """Generate quiz questions for comparison topic"""
    questions = []
    
    beginner_questions = [
        {
            'difficulty': 'beginner',
            'question': 'How do you say "bigger" in Spanish?',
            'correct': 'más grande',
            'options': ['más grande', 'grande', 'grandísimo', 'grandes'],
            'explanation': 'Use "más + adjective" for comparative forms'
        },
        {
            'difficulty': 'beginner',
            'question': 'What is the comparative of "bueno"?',
            'correct': 'mejor',
            'options': ['mejor', 'más bueno', 'buenísimo', 'más mejor'],
            'explanation': 'Irregular comparative: bueno → mejor'
        },
        {
            'difficulty': 'beginner',
            'question': 'How do you form the superlative in Spanish?',
            'correct': 'el/la/los/las + más + adjective',
            'options': ['el/la/los/las + más + adjective', 'más + el/la/los/las + adjective', 'adjective + ísimo', 'super + adjective'],
            'explanation': 'Superlative structure: definite article + más + adjective'
        },
        {
            'difficulty': 'beginner',
            'question': 'What does "peor" mean?',
            'correct': 'worse',
            'options': ['worse', 'worst', 'bad', 'worse than'],
            'explanation': 'Irregular comparative of "malo"'
        },
        {
            'difficulty': 'beginner',
            'question': 'Complete: Mi hermana es _____ que yo.',
            'correct': 'mayor',
            'options': ['mayor', 'más mayor', 'mayora', 'más grande'],
            'explanation': 'Irregular comparative: grande → mayor (for age)'
        },
        {
            'difficulty': 'beginner',
            'question': 'What is the superlative of "malo"?',
            'correct': 'peor',
            'options': ['peor', 'malísimo', 'más malo', 'el peor'],
            'explanation': 'Irregular superlative: malo → peor'
        }
    ]
    
    intermediate_questions = [
        {
            'difficulty': 'intermediate',
            'question': 'Choose the correct comparative: "Este restaurante es _____ que el otro."',
            'correct': 'mejor',
            'options': ['mejor', 'más bueno', 'buenísimo', 'más mejor'],
            'explanation': 'Irregular comparative for quality: mejor'
        },
        {
            'difficulty': 'intermediate',
            'question': 'What is the comparative of "joven"?',
            'correct': 'más joven',
            'options': ['más joven', 'jóven', 'jovenísimo', 'menor'],
            'explanation': 'Regular comparative formation'
        },
        {
            'difficulty': 'intermediate',
            'question': 'Complete the superlative: "Esta es la _____ película que he visto."',
            'correct': 'mejor',
            'options': ['mejor', 'más buena', 'buenísima', 'más mejor'],
            'explanation': 'Irregular superlative for quality'
        },
        {
            'difficulty': 'intermediate',
            'question': 'How do you say "smaller" in Spanish?',
            'correct': 'más pequeño',
            'options': ['más pequeño', 'menor', 'pequeñísimo', 'más chico'],
            'explanation': 'Regular comparative: más pequeño'
        },
        {
            'difficulty': 'intermediate',
            'question': 'What does "menor" mean in comparatives?',
            'correct': 'younger/smaller',
            'options': ['younger/smaller', 'bigger', 'older', 'worse'],
            'explanation': 'Irregular comparative of "pequeño/joven"'
        },
        {
            'difficulty': 'intermediate',
            'question': 'Choose the correct form: "Mi casa es _____ que la tuya."',
            'correct': 'más grande',
            'options': ['más grande', 'mayor', 'grandísima', 'más mayor'],
            'explanation': 'Regular comparative for size'
        },
        {
            'difficulty': 'intermediate',
            'question': 'What is the superlative of "pequeño"?',
            'correct': 'el más pequeño',
            'options': ['el más pequeño', 'menor', 'pequeñísimo', 'el menor'],
            'explanation': 'Regular superlative formation'
        },
        {
            'difficulty': 'intermediate',
            'question': 'Complete: "Este libro es _____ que el anterior."',
            'correct': 'mejor',
            'options': ['mejor', 'más bueno', 'buenísimo', 'más mejor'],
            'explanation': 'Irregular comparative for quality'
        },
        {
            'difficulty': 'intermediate',
            'question': 'How do you form comparatives with irregular adjectives?',
            'correct': 'Use special forms like mejor, peor, mayor, menor',
            'options': ['Use special forms like mejor, peor, mayor, menor', 'Add "más" to all adjectives', 'Use "super" prefix', 'Change the ending to -ísimo'],
            'explanation': 'Some adjectives have irregular comparative forms'
        },
        {
            'difficulty': 'intermediate',
            'question': 'What is the difference between "mayor" and "más grande"?',
            'correct': 'Mayor for age, más grande for size',
            'options': ['Mayor for age, más grande for size', 'They mean the same', 'Mayor for size, más grande for age', 'Mayor is superlative, más grande is comparative'],
            'explanation': 'Mayor = older, más grande = bigger'
        }
    ]
    
    advanced_questions = [
        {
            'difficulty': 'advanced',
            'question': 'In which cases do you use "mayor" instead of "más grande"?',
            'correct': 'For age and importance',
            'options': ['For age and importance', 'For size only', 'For quality', 'For all comparatives'],
            'explanation': 'Mayor is used for age (older) and importance (greater)'
        },
        {
            'difficulty': 'advanced',
            'question': 'What is the comparative of "mucho"?',
            'correct': 'más',
            'options': ['más', 'muchísimo', 'más mucho', 'mucho más'],
            'explanation': 'Mucho uses "más" in comparative constructions'
        },
        {
            'difficulty': 'advanced',
            'question': 'How do you express "the best in the world"?',
            'correct': 'el mejor del mundo',
            'options': ['el mejor del mundo', 'el más bueno del mundo', 'buenísimo del mundo', 'mejor del mundo'],
            'explanation': 'Use irregular superlative + definite article + del/de la'
        },
        {
            'difficulty': 'advanced',
            'question': 'What is the superlative of "poco"?',
            'correct': 'el menos',
            'options': ['el menos', 'poquísimo', 'menos', 'el más poco'],
            'explanation': 'Poco uses "menos" in superlative constructions'
        }
    ]
    
    # Distribute questions: 30% beginner, 50% intermediate, 20% advanced
    questions.extend(beginner_questions[:2])  # 2 beginner
    questions.extend(intermediate_questions[:8])  # 8 intermediate  
    questions.extend(advanced_questions[:2])  # 2 advanced
    
    return questions

def update_csv_content():
    """Read the CSV, replace placeholder content, and write back"""
    
    # Read the current CSV
    with open('/Users/home/Documents/Projects/language-gems-recovered/spanish_grammar_content_COMPLETE.csv', 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Generate new content for comparison topic
    comparison_practice = generate_comparison_practice()
    comparison_quiz = generate_comparison_quiz()
    
    # Find comparison rows and replace content
    practice_index = 0
    quiz_index = 0
    
    for i, row in enumerate(rows):
        if row['slug'] == 'comparison':
            if row['content_type'] == 'practice' and practice_index < len(comparison_practice):
                exercise = comparison_practice[practice_index]
                row['exercise_type'] = exercise['type']
                row['exercise_instructions'] = exercise['instruction']
                row['prompt_sentence'] = exercise['sentence']
                row['prompt_answer'] = exercise['answer']
                row['prompt_explanation'] = exercise['explanation']
                if 'options' in exercise:
                    row['prompt_options'] = '|'.join(exercise['options'])
                practice_index += 1
                
            elif row['content_type'] == 'quiz' and quiz_index < len(comparison_quiz):
                question = comparison_quiz[quiz_index]
                row['question_text'] = question['question']
                row['question_correct_answer'] = question['correct']
                row['question_options'] = '|'.join(question['options'])
                row['question_explanation'] = question['explanation']
                row['question_difficulty'] = question['difficulty']
                quiz_index += 1
    
    # Write back to CSV
    with open('/Users/home/Documents/Projects/language-gems-recovered/spanish_grammar_content_COMPLETE.csv', 'w', newline='', encoding='utf-8') as f:
        if rows:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)

if __name__ == '__main__':
    update_csv_content()
    print("Updated comparison topic content in CSV")