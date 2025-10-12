const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            // Title Page
            new Paragraph({
                text: "LanguageGems Premium Resource",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "AQA GCSE Spanish Writing Exam Kit",
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "Foundation Tier (Paper 4) - 50 Page Teacher & Student Workbook",
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "Target Audience: GCSE Spanish Teachers and Foundation Tier Students (AQA 8698/WF)",
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "Price Suggestion: £8.99 (One-time purchase for unlimited classroom use/digital access link)",
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: "Total Pages: 50 Pages",
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 1: Introduction & Exam Strategy
            new Paragraph({
                text: "SECTION 1: Introduction & Exam Strategy (Pages 1-8)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Page Range\tContent Focus\tResource Type",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "P. 1\tTitle Page\tBranding & Exam Specification (AQA 8698/WF)",
            }),
            new Paragraph({
                text: "P. 2\tIntroduction\tHow to use the LanguageGems Kit (Printable & Digital Components)",
            }),
            new Paragraph({
                text: "P. 3\tExam Blueprint\tFoundation Writing Paper: 4 Questions, Marks, Time Allocation (60 minutes total)",
            }),
            new Paragraph({
                text: "P. 4-5\tThe Foundation Mark Scheme (Q4 Focus)\tDetailed Breakdown of the 16-mark 90-word question: Content (10 marks) & Quality of Language (6 marks). Includes bullet point requirements (must cover all 4) and use of opinions/justification.",
            }),
            new Paragraph({
                text: "P. 6\tTense Toolkit for Foundation\tKey high-frequency verbs (regular and irregular) for Present, Preterite, Near Future (essential for Q4).",
            }),
            new Paragraph({
                text: "P. 7-8\tSuccess Acronyms\tP.P.O.F. (Past, Present, Opinion, Future) and J.O.E. (Justify Opinion with Example) explained with simple Spanish sentence starters.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Introduction content
            new Paragraph({
                text: "Introduction",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Welcome to the LanguageGems AQA GCSE Spanish Writing Exam Kit for Foundation Tier. This comprehensive 50-page workbook is designed to help teachers and students master the Foundation Writing Paper (Paper 4) of the AQA 8698 specification.",
            }),
            new Paragraph({
                text: "How to Use This Kit:",
            }),
            new Paragraph({
                text: "• Printable Workbook: Print double-sided for classroom use",
            }),
            new Paragraph({
                text: "• Digital Access: Scan the QR code on page 50 for online resources",
            }),
            new Paragraph({
                text: "• Teacher Resources: Answer keys and additional materials included",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Exam Blueprint
            new Paragraph({
                text: "Exam Blueprint",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Foundation Writing Paper: 60 minutes total",
            }),
            new Paragraph({
                text: "Question 1: Photo Card Description (8 marks) - 5-6 sentences",
            }),
            new Paragraph({
                text: "Question 2: 40/50 Word Response (16 marks) - Address 4 bullet points",
            }),
            new Paragraph({
                text: "Question 3: English to Spanish Translation (10 marks) - 5 sentences",
            }),
            new Paragraph({
                text: "Question 4: 90-Word Structured Response (16 marks) - Choice of 2 questions",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Mark Scheme
            new Paragraph({
                text: "The Foundation Mark Scheme (Q4 Focus)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "16-mark 90-word question breakdown:",
            }),
            new Paragraph({
                text: "Content (10 marks): Must cover all 4 bullet points",
            }),
            new Paragraph({
                text: "Quality of Language (6 marks): Use of tenses, opinions, justification",
            }),
            new Paragraph({
                text: "Bullet point requirements: Past experiences, Present situation, Opinion with justification, Future plans",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Tense Toolkit
            new Paragraph({
                text: "Tense Toolkit for Foundation",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Key verbs for Present: ser, estar, tener, ir, hacer",
            }),
            new Paragraph({
                text: "Preterite: fui, estuve, tuve, fui, hice",
            }),
            new Paragraph({
                text: "Near Future: voy a + infinitive",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Success Acronyms
            new Paragraph({
                text: "Success Acronyms",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "P.P.O.F. (Past, Present, Opinion, Future)",
            }),
            new Paragraph({
                text: "• Past: Describe experiences",
            }),
            new Paragraph({
                text: "• Present: Current situation",
            }),
            new Paragraph({
                text: "• Opinion: Give opinion with justification",
            }),
            new Paragraph({
                text: "• Future: Future plans",
            }),
            new Paragraph({
                text: "J.O.E. (Justify Opinion with Example)",
            }),
            new Paragraph({
                text: "• Justify: Explain why",
            }),
            new Paragraph({
                text: "• Opinion: State opinion",
            }),
            new Paragraph({
                text: "• Example: Give example",
            }),
            new Paragraph({
                text: "Spanish starters: Creo que..., Pienso que..., Me gusta porque...",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 2: Question 1
            new Paragraph({
                text: "SECTION 2: Question 1 – Photo Card (8 Marks)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Q1 Walkthrough: Describe & Opine",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "Task: 4 simple sentences describing the image + 1 sentence giving opinion on the topic.",
            }),
            new Paragraph({
                text: "Key vocabulary: hay, veo, colores, números",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Model Answers
            new Paragraph({
                text: "Model Answers & Analysis",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Model 1: Family gathering",
            }),
            new Paragraph({
                text: "En la foto hay una familia grande. Veo a los abuelos, padres y tres hijos. Están en el jardín. Me gusta pasar tiempo con mi familia porque es divertido.",
            }),
            new Paragraph({
                text: "Analysis: Uses 'hay' for 'there is/are', 'veo' for 'I see', adjective agreement (familia grande)",
            }),
            new Paragraph({
                text: "Model 2: Friends at school",
            }),
            new Paragraph({
                text: "En la foto veo a mis amigos en la escuela. Hay cinco chicos y tres chicas. Están en el patio. Me gusta ir a la escuela con mis amigos.",
            }),
            new Paragraph({
                text: "Analysis: Numbers (cinco, tres), location (patio), simple conjunctions",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Practice Set 1
            new Paragraph({
                text: "Practice Set 1: Theme 1 - Identity & Relationships",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Prompt 1: Una familia en el parque",
            }),
            new Paragraph({
                text: "Describe la foto: Hay una familia en el parque. Veo a un padre, una madre y dos hijos. La familia está feliz. Me gusta pasar tiempo en familia.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Prompt 2: Amigos en la escuela",
            }),
            new Paragraph({
                text: "Describe la foto: En la foto hay amigos en la escuela. Veo a cuatro chicos jugando al fútbol. Están en el patio. Me gusta jugar con mis amigos.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Prompt 3: Tiempo libre con la familia",
            }),
            new Paragraph({
                text: "Describe la foto: Hay una familia en casa. Veo a los padres y hijos viendo la televisión. Están en el salón. Me gusta ver la televisión en familia.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Practice Set 2
            new Paragraph({
                text: "Practice Set 2: Theme 2 & 3 - Town, Environment & Study",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Prompt 1: El centro de la ciudad",
            }),
            new Paragraph({
                text: "Describe la foto: En la foto veo el centro de una ciudad. Hay muchas tiendas y un cine grande. La ciudad está animada. Me gusta ir al centro de la ciudad.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Prompt 2: Un parque en el pueblo",
            }),
            new Paragraph({
                text: "Describe la foto: Hay un parque bonito en el pueblo. Veo árboles verdes y un lago. El parque está tranquilo. Me gusta pasear en el parque.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Prompt 3: Estudiando en casa",
            }),
            new Paragraph({
                text: "Describe la foto: En la foto hay un estudiante estudiando. Veo libros y un ordenador en la mesa. La habitación está ordenada. Me gusta estudiar en casa.",
            }),
            new Paragraph({
                text: "Tu respuesta:",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 3: Question 2
            new Paragraph({
                text: "SECTION 3: Question 2 – The 40/50 Word Response (16 Marks)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Q2 Walkthrough: Bullet Point Relay",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "Task: Address all 4 bullet points in 4-5 linked sentences (40-50 words)",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Grammar Focus
            new Paragraph({
                text: "Grammar Focus: Present Tense Mastery",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Regular verbs: hablar - hablo, comer - como, vivir - vivo",
            }),
            new Paragraph({
                text: "Irregular: ir - voy, hacer - hago, jugar - juego",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Model Answers
            new Paragraph({
                text: "Model Answers & Scaffold",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Model 1: Email to friend about town",
            }),
            new Paragraph({
                text: "Hola, vivo en una ciudad pequeña. Hay un cine y un parque. Me gusta ir al cine los fines de semana. ¿Quieres venir?",
            }),
            new Paragraph({
                text: "Scaffold: 1. Greeting 2. Description 3. Activities 4. Invitation",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Model 2: Note about school day",
            }),
            new Paragraph({
                text: "Mi día en la escuela es muy ocupado. Estudio matemáticas, inglés y español. Me gusta la clase de educación física. Después de la escuela, hago los deberes.",
            }),
            new Paragraph({
                text: "Scaffold: 1. Introduction 2. Subjects 3. Favourite 4. After school",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Model 3: Message about free time",
            }),
            new Paragraph({
                text: "En mi tiempo libre, juego al fútbol con mis amigos. También veo películas en casa. Me gusta escuchar música. Los fines de semana salgo con la familia.",
            }),
            new Paragraph({
                text: "Scaffold: 1. Sports 2. Home activities 3. Music 4. Weekends",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Practice Set 3
            new Paragraph({
                text: "Practice Set 3: 40-Word Questions",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Question 1: Email to a friend about your town",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "• Mention what there is in your town",
            }),
            new Paragraph({
                text: "• Say what you do there",
            }),
            new Paragraph({
                text: "• Ask about their town",
            }),
            new Paragraph({
                text: "• Invite them to visit",
            }),
            new Paragraph({
                text: "Tu respuesta (40-50 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Question 2: Note about your school day",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "• Describe your school day",
            }),
            new Paragraph({
                text: "• Mention subjects you study",
            }),
            new Paragraph({
                text: "• Say what you enjoy",
            }),
            new Paragraph({
                text: "• Describe what you do after school",
            }),
            new Paragraph({
                text: "Tu respuesta (40-50 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Question 3: Message about your free time",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "• Describe what you do in your free time",
            }),
            new Paragraph({
                text: "• Mention activities with friends",
            }),
            new Paragraph({
                text: "• Say what you do at home",
            }),
            new Paragraph({
                text: "• Describe weekend activities",
            }),
            new Paragraph({
                text: "Tu respuesta (40-50 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Question 4: Email about your family",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "• Describe your family",
            }),
            new Paragraph({
                text: "• Say what you do together",
            }),
            new Paragraph({
                text: "• Mention your favourite family member",
            }),
            new Paragraph({
                text: "• Ask about their family",
            }),
            new Paragraph({
                text: "Tu respuesta (40-50 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 4: Question 3
            new Paragraph({
                text: "SECTION 4: Question 3 – English to Spanish Translation (10 Marks)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Q3 Walkthrough: The Minimum 35-Word Challenge",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "Task: Translate 5 separate English sentences into Spanish",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Common Errors
            new Paragraph({
                text: "Common Translation Errors",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "• Adjective agreement: la casa grande (not grande casa)",
            }),
            new Paragraph({
                text: "• Ser vs Estar: Soy feliz (permanent) vs Estoy feliz (temporary)",
            }),
            new Paragraph({
                text: "• Avoid literal translation",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Translation Practice
            new Paragraph({
                text: "Translation Practice: Theme 1 & 2",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Block A: Family & Relationships",
            }),
            new Paragraph({
                text: "1. I live with my parents. - Vivo con mis padres.",
            }),
            new Paragraph({
                text: "2. My sister is 15 years old. - Mi hermana tiene 15 años.",
            }),
            new Paragraph({
                text: "3. We have a big family. - Tenemos una familia grande.",
            }),
            new Paragraph({
                text: "4. My brother plays football. - Mi hermano juega al fútbol.",
            }),
            new Paragraph({
                text: "5. I love my grandparents. - Quiero a mis abuelos.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block B: Free Time",
            }),
            new Paragraph({
                text: "6. I play tennis on Saturdays. - Juego al tenis los sábados.",
            }),
            new Paragraph({
                text: "7. My friends like music. - A mis amigos les gusta la música.",
            }),
            new Paragraph({
                text: "8. We go to the cinema. - Vamos al cine.",
            }),
            new Paragraph({
                text: "9. I watch TV at home. - Veo la televisión en casa.",
            }),
            new Paragraph({
                text: "10. They listen to the radio. - Escuchan la radio.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block C: School",
            }),
            new Paragraph({
                text: "11. I study Spanish at school. - Estudio español en la escuela.",
            }),
            new Paragraph({
                text: "12. My teacher is strict. - Mi profesor es estricto.",
            }),
            new Paragraph({
                text: "13. We have lunch at 12 o'clock. - Almorzamos a las doce.",
            }),
            new Paragraph({
                text: "14. The classroom is big. - El aula es grande.",
            }),
            new Paragraph({
                text: "15. I do my homework. - Hago mis deberes.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block D: Town & Environment",
            }),
            new Paragraph({
                text: "16. The town is small. - El pueblo es pequeño.",
            }),
            new Paragraph({
                text: "17. There is a park near my house. - Hay un parque cerca de mi casa.",
            }),
            new Paragraph({
                text: "18. I go shopping in the centre. - Voy de compras al centro.",
            }),
            new Paragraph({
                text: "19. The shops are modern. - Las tiendas son modernas.",
            }),
            new Paragraph({
                text: "20. We walk in the street. - Caminamos por la calle.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block E: Food & Health",
            }),
            new Paragraph({
                text: "21. I eat fruit every day. - Como fruta todos los días.",
            }),
            new Paragraph({
                text: "22. My favourite food is pizza. - Mi comida favorita es la pizza.",
            }),
            new Paragraph({
                text: "23. I drink water with meals. - Bebo agua con las comidas.",
            }),
            new Paragraph({
                text: "24. Vegetables are healthy. - Las verduras son saludables.",
            }),
            new Paragraph({
                text: "25. I feel happy. - Me siento feliz.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Mixed Themes
            new Paragraph({
                text: "Translation Practice: Mixed Themes & Tenses",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "1. Last year I visited Spain with my family. - El año pasado visité España con mi familia.",
            }),
            new Paragraph({
                text: "2. I am studying French and German at school. - Estoy estudiando francés y alemán en la escuela.",
            }),
            new Paragraph({
                text: "3. Tomorrow I will go to the cinema with my friends. - Mañana iré al cine con mis amigos.",
            }),
            new Paragraph({
                text: "4. When I was young, I played in the park every day. - Cuando era pequeño, jugaba en el parque todos los días.",
            }),
            new Paragraph({
                text: "5. I have eaten pizza three times this week. - He comido pizza tres veces esta semana.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "6. My brother has a new bicycle and he rides it every weekend. - Mi hermano tiene una bicicleta nueva y la monta todos los fines de semana.",
            }),
            new Paragraph({
                text: "7. I went shopping yesterday and bought new clothes. - Fui de compras ayer y compré ropa nueva.",
            }),
            new Paragraph({
                text: "8. We are going to travel to Mexico next summer. - Vamos a viajar a México el próximo verano.",
            }),
            new Paragraph({
                text: "9. My parents have lived in this town for twenty years. - Mis padres han vivido en este pueblo durante veinte años.",
            }),
            new Paragraph({
                text: "10. I will study medicine when I finish school. - Estudiaré medicina cuando termine la escuela.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 5: Question 4
            new Paragraph({
                text: "SECTION 5: Question 4 – The 90-Word Structured Response (16 Marks)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Q4 Walkthrough: Maximising Marks",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "Task: Cover all 4 bullet points in ~90 words, using P.P.O.F. structure",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Planning Sheet
            new Paragraph({
                text: "Advanced Planning Sheet: P.P.O.F. in Detail",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Past: ________________________________________",
            }),
            new Paragraph({
                text: "Present: ______________________________________",
            }),
            new Paragraph({
                text: "Opinion + Justification: _________________________",
            }),
            new Paragraph({
                text: "Future: _______________________________________",
            }),
            new Paragraph({
                text: "Connectors: sin embargo, además, aunque",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Model Answer 1
            new Paragraph({
                text: "Model Answer 1: Family & Friends",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "El año pasado visité a mis abuelos en España. Ahora vivo con mis padres y mi hermana. Creo que la familia es importante porque nos apoyamos mutuamente. En el futuro, quiero formar mi propia familia.",
            }),
            new Paragraph({
                text: "Annotation: Past (visité), Present (vivo), Opinion (Creo que... importante), Future (quiero)",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Model Answer 2
            new Paragraph({
                text: "Model Answer 2: Free Time & Diet",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Antes jugaba al fútbol todos los días. Ahora hago ejercicio en el gimnasio. Me gusta comer saludable porque es bueno para la salud. Sin embargo, a veces como pizza. En el futuro, seguiré una dieta equilibrada.",
            }),
            new Paragraph({
                text: "Annotation: Links paragraphs with 'Sin embargo', uses J.O.E.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Practice Questions
            new Paragraph({
                text: "Practice Q5: School Life / Future Ambitions",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Describe your school life. What subjects do you study? Do you enjoy school? What are your future ambitions?",
            }),
            new Paragraph({
                text: "P.P.O.F. Planning Sheet:",
            }),
            new Paragraph({
                text: "Past: ________________________________________________________",
            }),
            new Paragraph({
                text: "Present: ______________________________________________________",
            }),
            new Paragraph({
                text: "Opinion + Justification: _________________________________________",
            }),
            new Paragraph({
                text: "Future: _______________________________________________________",
            }),
            new Paragraph({
                text: "Tu respuesta (aprox. 90 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Practice Q6: Technology / Social Media",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "How do you use technology? What social media do you use? Is technology positive or negative? How will technology change in the future?",
            }),
            new Paragraph({
                text: "P.P.O.F. Planning Sheet:",
            }),
            new Paragraph({
                text: "Past: ________________________________________________________",
            }),
            new Paragraph({
                text: "Present: ______________________________________________________",
            }),
            new Paragraph({
                text: "Opinion + Justification: _________________________________________",
            }),
            new Paragraph({
                text: "Future: _______________________________________________________",
            }),
            new Paragraph({
                text: "Tu respuesta (aprox. 90 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Practice Q7: Travel & Tourism / Town",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Have you travelled abroad? Describe your town. Do you like travelling? Where do you want to travel in the future?",
            }),
            new Paragraph({
                text: "P.P.O.F. Planning Sheet:",
            }),
            new Paragraph({
                text: "Past: ________________________________________________________",
            }),
            new Paragraph({
                text: "Present: ______________________________________________________",
            }),
            new Paragraph({
                text: "Opinion + Justification: _________________________________________",
            }),
            new Paragraph({
                text: "Future: _______________________________________________________",
            }),
            new Paragraph({
                text: "Tu respuesta (aprox. 90 palabras):",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                text: "____________________________________________________________",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            // Section 6: Answer Key
            new Paragraph({
                text: "SECTION 6: Answer Key & Teacher Resources (Page 50)",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "Answer Key & Digital Access",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                text: "Translation Answers (Q3):",
                heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
                text: "Block A:",
            }),
            new Paragraph({
                text: "1. Vivo con mis padres.",
            }),
            new Paragraph({
                text: "2. Mi hermana tiene 15 años.",
            }),
            new Paragraph({
                text: "3. Tenemos una familia grande.",
            }),
            new Paragraph({
                text: "4. Mi hermano juega al fútbol.",
            }),
            new Paragraph({
                text: "5. Quiero a mis abuelos.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block B:",
            }),
            new Paragraph({
                text: "6. Juego al tenis los sábados.",
            }),
            new Paragraph({
                text: "7. A mis amigos les gusta la música.",
            }),
            new Paragraph({
                text: "8. Vamos al cine.",
            }),
            new Paragraph({
                text: "9. Veo la televisión en casa.",
            }),
            new Paragraph({
                text: "10. Escuchan la radio.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block C:",
            }),
            new Paragraph({
                text: "11. Estudio español en la escuela.",
            }),
            new Paragraph({
                text: "12. Mi profesor es estricto.",
            }),
            new Paragraph({
                text: "13. Almorzamos a las doce.",
            }),
            new Paragraph({
                text: "14. El aula es grande.",
            }),
            new Paragraph({
                text: "15. Hago mis deberes.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block D:",
            }),
            new Paragraph({
                text: "16. El pueblo es pequeño.",
            }),
            new Paragraph({
                text: "17. Hay un parque cerca de mi casa.",
            }),
            new Paragraph({
                text: "18. Voy de compras al centro.",
            }),
            new Paragraph({
                text: "19. Las tiendas son modernas.",
            }),
            new Paragraph({
                text: "20. Caminamos por la calle.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Block E:",
            }),
            new Paragraph({
                text: "21. Como fruta todos los días.",
            }),
            new Paragraph({
                text: "22. Mi comida favorita es la pizza.",
            }),
            new Paragraph({
                text: "23. Bebo agua con las comidas.",
            }),
            new Paragraph({
                text: "24. Las verduras son saludables.",
            }),
            new Paragraph({
                text: "25. Me siento feliz.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Mixed Themes & Tenses:",
            }),
            new Paragraph({
                text: "1. El año pasado visité España con mi familia.",
            }),
            new Paragraph({
                text: "2. Estoy estudiando francés y alemán en la escuela.",
            }),
            new Paragraph({
                text: "3. Mañana iré al cine con mis amigos.",
            }),
            new Paragraph({
                text: "4. Cuando era pequeño, jugaba en el parque todos los días.",
            }),
            new Paragraph({
                text: "5. He comido pizza tres veces esta semana.",
            }),
            new Paragraph({
                text: "6. Mi hermano tiene una bicicleta nueva y la monta todos los fines de semana.",
            }),
            new Paragraph({
                text: "7. Fui de compras ayer y compré ropa nueva.",
            }),
            new Paragraph({
                text: "8. Vamos a viajar a México el próximo verano.",
            }),
            new Paragraph({
                text: "9. Mis padres han vivido en este pueblo durante veinte años.",
            }),
            new Paragraph({
                text: "10. Estudiaré medicina cuando termine la escuela.",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Q1 Practice Notes:",
            }),
            new Paragraph({
                text: "• Focus on 4-5 sentences total",
            }),
            new Paragraph({
                text: "• Use 'hay' and 'veo' for description",
            }),
            new Paragraph({
                text: "• Include opinion in final sentence",
            }),
            new Paragraph({
                text: "• Check adjective agreement",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "Q2 Practice Notes:",
            }),
            new Paragraph({
                text: "• Address all 4 bullet points",
            }),
            new Paragraph({
                text: "• Use present tense mainly",
            }),
            new Paragraph({
                text: "• Link sentences with conjunctions",
            }),
            new Paragraph({
                text: "• Aim for 40-50 words",
            }),
            new Paragraph({
                children: [new TextRun({ break: 1 })], // Page break
            }),

            new Paragraph({
                text: "QR Code: [Placeholder for LanguageGems QR Code]",
            }),
            new Paragraph({
                text: "Digital access to AI Worksheet Generator templates and VocabMaster phrase lists.",
            }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('AQA_GCSE_Spanish_Writing_Exam_Kit_Foundation.docx', buffer);
    console.log('Document created successfully!');
});