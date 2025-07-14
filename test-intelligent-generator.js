const IntelligentWorksheetGenerator = require('./intelligent-worksheet-generator');

async function testIntelligentGeneration() {
    const generator = new IntelligentWorksheetGenerator();
    
    const worksheetConfig = {
        title: "Spanish Present Tense - Regular Verbs",
        sections: [
            {
                title: "Fill in the Blanks",
                type: "fillBlanks",
                content: [
                    { sentence: "Yo ___ español todos los días. (hablar)" },
                    { sentence: "Ella ___ en una oficina. (trabajar)" },
                    { sentence: "Nosotros ___ la televisión. (mirar)" },
                    { sentence: "Ellos ___ mucho chocolate. (comer)" },
                    { sentence: "Tú ___ libros interesantes. (leer)" },
                    { sentence: "Vosotros ___ en Madrid. (vivir)" }
                ]
            },
            {
                title: "Multiple Choice",
                type: "multipleChoice",
                content: [
                    {
                        question: "What is the correct conjugation of 'hablar' for 'él'?",
                        options: ["habla", "hablas", "hablamos", "hablan"]
                    },
                    {
                        question: "Which ending is used for -ER verbs with 'nosotros'?",
                        options: ["-amos", "-emos", "-imos", "-en"]
                    },
                    {
                        question: "'Viven' is the conjugation for:",
                        options: ["yo", "tú", "él/ella", "ellos/ellas"]
                    }
                ]
            },
            {
                title: "Verb Conjugation Tables",
                type: "conjugationTable",
                content: [
                    {
                        infinitive: "HABLAR (to speak)",
                        pronouns: ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ellas/ustedes"]
                    },
                    {
                        infinitive: "COMER (to eat)",
                        pronouns: ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ellas/ustedes"]
                    }
                ]
            },
            {
                title: "Translation Practice",
                type: "translation",
                content: [
                    { spanish: "Yo hablo inglés y francés." },
                    { spanish: "Ella come pizza los viernes." },
                    { spanish: "Nosotros vivimos en una casa grande." },
                    { spanish: "Ellos estudian medicina." },
                    { spanish: "Tú trabajas en el hospital." },
                    { spanish: "Vosotros leéis el periódico." }
                ]
            },
            {
                title: "Creative Writing",
                type: "writing",
                content: [
                    "Write 3 sentences about your daily routine using -AR verbs:",
                    "Describe what your family members do using -ER verbs:",
                    "Create a short story (4-5 sentences) using at least 5 different regular verbs:"
                ]
            }
        ]
    };
    
    console.log('🚀 Generating intelligent worksheet...');
    
    try {
        await generator.generatePDF(
            worksheetConfig, 
            `Intelligent-Spanish-Worksheet-${new Date().toISOString().split('T')[0]}.pdf`
        );
        
        console.log('✅ Intelligent worksheet generated successfully!');
        console.log('📋 Features:');
        console.log('   • Fixed section heights (2.2in each)');
        console.log('   • Intelligent page breaks');
        console.log('   • Consistent footer positioning');
        console.log('   • Precise measurement calculations');
        console.log('   • Professional Language Gems branding');
        console.log('   • Zero white space issues');
        
    } catch (error) {
        console.error('❌ Error generating worksheet:', error);
    }
}

// Run the test
testIntelligentGeneration(); 