#!/usr/bin/env node

const { generateWorksheet } = require('./master-worksheet-generator');

// Quick worksheet templates
const templates = {
  french: () => ({
    title: 'French Present Tense: -ER, -RE, -IR Verbs',
    sections: [
      {
        title: 'Reference Guide',
        type: 'reference',
        content: {
          verbTypes: {
            er: {
              name: '-ER Verbs',
              example: 'parler (to speak)', 
              conjugations: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent']
            },
            re: {
              name: '-RE Verbs',
              example: 'vendre (to sell)',
              conjugations: ['vends', 'vends', 'vend', 'vendons', 'vendez', 'vendent']
            },
            ir: {
              name: '-IR Verbs', 
              example: 'finir (to finish)',
              conjugations: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent']
            }
          },
          pronouns: ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']
        }
      },
      {
        title: 'Fill in the Blanks',
        type: 'fillBlanks',
        content: [
          { sentence: 'Je _____ français à l\'école.', verb: 'parler' },
          { sentence: 'Tu _____ tes devoirs maintenant.', verb: 'finir' },
          { sentence: 'Elle _____ des livres à la librairie.', verb: 'vendre' },
          { sentence: 'Nous _____ beaucoup de légumes.', verb: 'manger' },
          { sentence: 'Vous _____ votre travail à 17h.', verb: 'finir' },
          { sentence: 'Ils _____ leur maison en été.', verb: 'vendre' }
        ]
      },
      {
        title: 'Translation Practice',
        type: 'translation',
        content: [
          { source: 'I speak French every day.', target: 'French' },
          { source: 'You finish your homework.', target: 'French' },
          { source: 'She sells beautiful flowers.', target: 'French' },
          { source: 'We listen to music together.', target: 'French' }
        ]
      },
      {
        title: 'Verb Challenge',
        type: 'challenge',
        content: {
          title: 'Complete the Conjugation',
          instructions: 'Add the correct ending to complete each verb:',
          items: [
            { stem: 'parl', hint: 'nous' },
            { stem: 'fini', hint: 'tu' },
            { stem: 'vend', hint: 'il' },
            { stem: 'écout', hint: 'vous' }
          ],
          bank: ['-ons', '-s', '-ent', '-ez']
        }
      }
    ]
  }),

  spanish: () => ({
    title: 'Spanish Present Tense: Regular Verbs',
    sections: [
      {
        title: 'Reference Guide',
        type: 'reference',
        content: {
          verbTypes: {
            ar: {
              name: '-AR Verbs',
              example: 'hablar (to speak)',
              conjugations: ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan']
            },
            er: {
              name: '-ER Verbs',
              example: 'comer (to eat)',
              conjugations: ['como', 'comes', 'come', 'comemos', 'coméis', 'comen']
            },
            ir: {
              name: '-IR Verbs',
              example: 'vivir (to live)',
              conjugations: ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven']
            }
          },
          pronouns: ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas']
        }
      },
      {
        title: 'Fill in the Blanks',
        type: 'fillBlanks',
        content: [
          { sentence: 'Yo _____ español todos los días.', verb: 'hablar' },
          { sentence: 'Tú _____ en un restaurante.', verb: 'comer' },
          { sentence: 'Ella _____ en Madrid.', verb: 'vivir' },
          { sentence: 'Nosotros _____ música.', verb: 'escuchar' },
          { sentence: 'Vosotros _____ libros.', verb: 'leer' },
          { sentence: 'Ellos _____ en el parque.', verb: 'correr' }
        ]
      },
      {
        title: 'Translation Practice',
        type: 'translation',
        content: [
          { source: 'I speak Spanish every day.', target: 'Spanish' },
          { source: 'You eat in the restaurant.', target: 'Spanish' },
          { source: 'We live in a big house.', target: 'Spanish' },
          { source: 'They study mathematics.', target: 'Spanish' }
        ]
      }
    ]
  })
};

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🇫🇷🇪🇸 Language Gems Worksheet Generator

Usage:
  node create-worksheet.js french    # Generate French worksheet
  node create-worksheet.js spanish   # Generate Spanish worksheet
  
Available templates: ${Object.keys(templates).join(', ')}
    `);
    return;
  }

  const templateName = args[0].toLowerCase();
  
  if (!templates[templateName]) {
    console.error(`❌ Template '${templateName}' not found.`);
    console.log(`Available: ${Object.keys(templates).join(', ')}`);
    return;
  }

  try {
    console.log(`🚀 Generating ${templateName} worksheet...`);
    const config = templates[templateName]();
    const filename = await generateWorksheet(config);
    console.log(`✅ Perfect! Generated: ${filename}`);
    console.log(`📄 Ready to print and use in your classroom!`);
  } catch (error) {
    console.error('❌ Error generating worksheet:', error.message);
  }
}

main(); 