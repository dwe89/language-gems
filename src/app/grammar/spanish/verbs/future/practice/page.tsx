'use client';

import { Metadata } from 'next';
import GrammarPractice from '@/components/grammar/GrammarPractice';



const practiceItems = [
  {
    id: "future-1",
    type: "fill_blank" as const,
    question: "Mañana yo _____ (hablar) con el director.",
    answer: "hablaré",
    hint: "Regular -ar verbs in future: yo form ends in -é",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-2",
    type: "fill_blank" as const,
    question: "Ellos _____ (comer) en el restaurante nuevo.",
    answer: "comerán",
    hint: "Regular -er verbs in future: ellos form ends in -án",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-3",
    type: "fill_blank" as const,
    question: "Nosotros _____ (vivir) en España el próximo año.",
    answer: "viviremos",
    hint: "Regular -ir verbs in future: nosotros form ends in -emos",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-4",
    type: "fill_blank" as const,
    question: "¿Qué _____ (hacer) tú este fin de semana?",
    answer: "harás",
    hint: "Hacer is irregular in future: har- + ás = harás",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-5",
    type: "fill_blank" as const,
    question: "Ella _____ (tener) que estudiar mucho.",
    answer: "tendrá",
    hint: "Tener is irregular in future: tendr- + á = tendrá",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-6",
    type: "fill_blank" as const,
    question: "Ustedes _____ (poder) venir a la fiesta.",
    answer: "podrán",
    hint: "Poder is irregular in future: podr- + án = podrán",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-7",
    type: "fill_blank" as const,
    question: "Yo _____ (salir) temprano del trabajo.",
    answer: "saldré",
    hint: "Salir is irregular in future: saldr- + é = saldré",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-8",
    type: "fill_blank" as const,
    question: "Los estudiantes _____ (venir) a clase mañana.",
    answer: "vendrán",
    hint: "Venir is irregular in future: vendr- + án = vendrán",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-9",
    type: "fill_blank" as const,
    question: "Tú _____ (decir) la verdad, ¿no?",
    answer: "dirás",
    hint: "Decir is irregular in future: dir- + ás = dirás",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-10",
    type: "fill_blank" as const,
    question: "Mi hermana _____ (poner) la mesa para la cena.",
    answer: "pondrá",
    hint: "Poner is irregular in future: pondr- + á = pondrá",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-11",
    type: "fill_blank" as const,
    question: "Mañana nosotros _____ al cine.",
    answer: "iremos",
    options: ["vamos", "fuimos", "iremos", "íbamos"],
    hint: "Ir is irregular in future: iremos (we will go)",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-12",
    type: "fill_blank" as const,
    question: "Ella _____ el libro la próxima semana.",
    answer: "leerá",
    options: ["lee", "leyó", "leerá", "leía"],
    hint: "Regular -er verb in future: leerá (she will read)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-13",
    type: "fill_blank" as const,
    question: "Ellos _____ en el hotel.",
    answer: "quedarán",
    options: ["quedan", "quedaron", "quedarán", "quedaban"],
    hint: "Regular -ar verb in future: quedarán (they will stay)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-14",
    type: "fill_blank" as const,
    question: "Yo _____ mi tarea esta noche.",
    answer: "haré",
    options: ["hago", "hice", "haré", "hacía"],
    hint: "Hacer is irregular in future: haré (I will do)",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-15",
    type: "fill_blank" as const,
    question: "Tú _____ muy bien en el examen.",
    answer: "saldrás",
    options: ["sales", "saliste", "saldrás", "salías"],
    hint: "Salir is irregular in future: saldrás (you will do/come out)",
    difficulty: "intermediate" as const,
    category: "future-tense"
  },
  {
    id: "future-16",
    type: "translation" as const,
    question: "I will buy a new house next year.",
    answer: "Compraré una casa nueva el próximo año.",
    hint: "Regular -ar verb in future: compraré (I will buy)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-17",
    type: "translation" as const,
    question: "We will visit our friends on Sunday.",
    answer: "Visitaremos a nuestros amigos el domingo.",
    hint: "Regular -ar verb in future: visitaremos (we will visit)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-18",
    type: "translation" as const,
    question: "They will arrive late to the meeting.",
    answer: "Llegarán tarde a la reunión.",
    hint: "Regular -ar verb in future: llegarán (they will arrive)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-19",
    type: "translation" as const,
    question: "She will write a letter to her mother.",
    answer: "Escribirá una carta a su madre.",
    hint: "Regular -ir verb in future: escribirá (she will write)",
    difficulty: "beginner" as const,
    category: "future-tense"
  },
  {
    id: "future-20",
    type: "translation" as const,
    question: "You will know the answer tomorrow.",
    answer: "Sabrás la respuesta mañana.",
    hint: "Saber is irregular in future: sabrás (you will know)",
    difficulty: "intermediate" as const,
    category: "future-tense"
  }
];

export default function SpanishFuturePracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="verbs"
      difficulty="mixed"
      practiceItems={practiceItems}
      onComplete={(score, gemsEarned, timeSpent) => {
        console.log('Practice completed:', { score, gemsEarned, timeSpent });
      }}
      onExit={() => {
        window.history.back();
      }}
      gamified={true}
    />
  );
}
