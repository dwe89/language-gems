const FrenchWorksheetGenerator = require('./french-worksheet-generator');

async function generateFrenchWorksheet() {
    const generator = new FrenchWorksheetGenerator();
    
    const frenchWorksheetConfig = {
        title: "French Present Tense: -ER, -RE, -IR Verbs",
        studentName: "",
        className: "",
        date: new Date().toLocaleDateString(),
        sections: [
            // Page 1: Reference + Fill-in-blanks + Matching
            {
                title: "Reference Guide",
                type: "referenceTable",
                content: {} // The generator will create the reference table automatically
            },
            {
                title: "Fill in the Blanks",
                type: "fillBlanksAdvanced", 
                content: [
                    { sentence: "Je _____ français à l'école.", verb: "parler" },
                    { sentence: "Tu _____ tes devoirs maintenant.", verb: "finir" },
                    { sentence: "Elle _____ des livres à la librairie.", verb: "vendre" },
                    { sentence: "Nous _____ beaucoup de légumes.", verb: "manger" },
                    { sentence: "Vous _____ votre travail à 17h.", verb: "finir" },
                    { sentence: "Ils _____ leur maison en été.", verb: "vendre" },
                    { sentence: "On _____ de la musique classique.", verb: "écouter" },
                    { sentence: "Elles _____ leurs exercices rapidement.", verb: "finir" }
                ]
            },
            {
                title: "Matching Exercise",
                type: "matching",
                content: {
                    pronouns: ["je", "tu", "il", "nous", "vous", "elles"],
                    verbs: ["mange", "vendez", "parlent", "finis", "regardons", "choisis"]
                }
            },
            
            // Page 2: Translation + Verb Challenge
            {
                title: "English to French Translation", 
                type: "translationFrench",
                content: [
                    { english: "I speak French every day." },
                    { english: "You finish your homework." },
                    { english: "She sells beautiful flowers." },
                    { english: "We listen to music together." },
                    { english: "They choose the best restaurant." },
                    { english: "You (plural) wait for the bus." },
                    { english: "He studies mathematics at university." },
                    { english: "We sell our old car." }
                ]
            },
            {
                title: "Verb Endings Challenge",
                type: "verbPuzzle",
                content: {
                    type: "endings",
                    instructions: "Add the correct ending to complete each verb conjugation:",
                    data: {
                        items: [
                            { stem: "parl", pronoun: "nous" },
                            { stem: "fini", pronoun: "tu" }, 
                            { stem: "vend", pronoun: "il" },
                            { stem: "écout", pronoun: "vous" },
                            { stem: "chois", pronoun: "je" },
                            { stem: "regard", pronoun: "elles" },
                            { stem: "attend", pronoun: "nous" },
                            { stem: "réussi", pronoun: "ils" }
                        ],
                        endings: ["-ons", "-s", "-ent", "-ez", "-e", "-ent", "-ons", "-ssent"]
                    }
                }
            }
        ]
    };

    try {
        console.log("🇫🇷 Generating Professional French Present Tense Worksheet...");
        console.log("📄 Format: A4 (8.27\" x 11.69\")");
        console.log("📚 Content: -ER, -RE, -IR verb conjugations with reference table");
        console.log("🎯 Activities: Fill-blanks, matching, translation, verb challenge");
        
        const filename = await generator.generateWorksheet(frenchWorksheetConfig);
        
        console.log(`\n✅ French worksheet successfully created: ${filename}`);
        console.log("\n🎓 Worksheet Features:");
        console.log("   📋 Complete reference table (parler, vendre, finir)");
        console.log("   ✏️  Fill-in-the-blank exercises with verb hints");
        console.log("   🔗 Pronoun-to-verb matching activity");
        console.log("   🌍 English→French translation practice");
        console.log("   🧩 Interactive verb endings challenge");
        console.log("   📐 Professional A4 layout with consistent spacing");
        console.log("   👨‍🏫 Clear instructions for each section");
        console.log("   🎨 Clean, student-friendly design");
        
        console.log("\n📖 Perfect for:");
        console.log("   • French language classrooms");
        console.log("   • Present tense conjugation practice");
        console.log("   • Independent study or homework");
        console.log("   • Assessment preparation");
        
        return filename;
        
    } catch (error) {
        console.error("❌ Error generating French worksheet:", error);
        throw error;
    }
}

// Generate the worksheet
generateFrenchWorksheet()
    .then(filename => {
        console.log(`\n🎉 Ready to print and use: ${filename}`);
    })
    .catch(error => {
        console.error("Failed to generate worksheet:", error);
    }); 