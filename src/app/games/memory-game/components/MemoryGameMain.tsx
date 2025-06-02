'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { WordPair } from './CustomWordsModal';
import CustomWordsModal from './CustomWordsModal';

interface MemoryGameMainProps {
  language: string;
  topic: string;
  difficulty: string;
  onBackToSettings: () => void;
  customWords?: WordPair[];
}

// Vocabulary data for different topics and languages
const VOCABULARY: any = {
  animals: {
    english: [
      { term: 'dog', translation: 'perro' },
      { term: 'cat', translation: 'gato' },
      { term: 'bird', translation: 'pájaro' },
      { term: 'fish', translation: 'pez' },
      { term: 'horse', translation: 'caballo' },
      { term: 'rabbit', translation: 'conejo' },
      { term: 'lion', translation: 'león' },
      { term: 'tiger', translation: 'tigre' },
      { term: 'elephant', translation: 'elefante' },
      { term: 'monkey', translation: 'mono' },
      { term: 'bear', translation: 'oso' },
      { term: 'snake', translation: 'serpiente' },
      { term: 'frog', translation: 'rana' },
      { term: 'turtle', translation: 'tortuga' }
    ],
    spanish: [
      { term: 'perro', translation: 'dog' },
      { term: 'gato', translation: 'cat' },
      { term: 'pájaro', translation: 'bird' },
      { term: 'pez', translation: 'fish' },
      { term: 'caballo', translation: 'horse' },
      { term: 'conejo', translation: 'rabbit' },
      { term: 'león', translation: 'lion' },
      { term: 'tigre', translation: 'tiger' },
      { term: 'elefante', translation: 'elephant' },
      { term: 'mono', translation: 'monkey' },
      { term: 'oso', translation: 'bear' },
      { term: 'serpiente', translation: 'snake' },
      { term: 'rana', translation: 'frog' },
      { term: 'tortuga', translation: 'turtle' }
    ],
    // Add more languages as needed
  },
  colors: {
    english: [
      { term: 'red', translation: 'rojo' },
      { term: 'blue', translation: 'azul' },
      { term: 'green', translation: 'verde' },
      { term: 'yellow', translation: 'amarillo' },
      { term: 'orange', translation: 'naranja' },
      { term: 'purple', translation: 'morado' },
      { term: 'black', translation: 'negro' },
      { term: 'white', translation: 'blanco' },
      { term: 'brown', translation: 'marrón' },
      { term: 'pink', translation: 'rosa' },
      { term: 'gray', translation: 'gris' },
      { term: 'gold', translation: 'oro' },
      { term: 'silver', translation: 'plata' },
      { term: 'navy', translation: 'azul marino' }
    ],
    spanish: [
      { term: 'rojo', translation: 'red' },
      { term: 'azul', translation: 'blue' },
      { term: 'verde', translation: 'green' },
      { term: 'amarillo', translation: 'yellow' },
      { term: 'naranja', translation: 'orange' },
      { term: 'morado', translation: 'purple' },
      { term: 'negro', translation: 'black' },
      { term: 'blanco', translation: 'white' },
      { term: 'marrón', translation: 'brown' },
      { term: 'rosa', translation: 'pink' },
      { term: 'gris', translation: 'gray' },
      { term: 'oro', translation: 'gold' },
      { term: 'plata', translation: 'silver' },
      { term: 'azul marino', translation: 'navy' }
    ],
    // Add more languages as needed
  },
  // Add more topics with their vocabulary
  food: {
    english: [
      { term: 'apple', translation: 'manzana' },
      { term: 'bread', translation: 'pan' },
      { term: 'milk', translation: 'leche' },
      { term: 'water', translation: 'agua' },
      { term: 'cheese', translation: 'queso' },
      { term: 'meat', translation: 'carne' },
      { term: 'fish', translation: 'pescado' },
      { term: 'rice', translation: 'arroz' },
      { term: 'potato', translation: 'patata' },
      { term: 'tomato', translation: 'tomate' },
      { term: 'orange', translation: 'naranja' },
      { term: 'banana', translation: 'plátano' },
      { term: 'egg', translation: 'huevo' },
      { term: 'coffee', translation: 'café' }
    ],
    spanish: [
      { term: 'manzana', translation: 'apple' },
      { term: 'pan', translation: 'bread' },
      { term: 'leche', translation: 'milk' },
      { term: 'agua', translation: 'water' },
      { term: 'queso', translation: 'cheese' },
      { term: 'carne', translation: 'meat' },
      { term: 'pescado', translation: 'fish' },
      { term: 'arroz', translation: 'rice' },
      { term: 'patata', translation: 'potato' },
      { term: 'tomate', translation: 'tomato' },
      { term: 'naranja', translation: 'orange' },
      { term: 'plátano', translation: 'banana' },
      { term: 'huevo', translation: 'egg' },
      { term: 'café', translation: 'coffee' }
    ]
  },
  countries: {
    english: [
      { term: 'spain', translation: 'españa' },
      { term: 'france', translation: 'francia' },
      { term: 'germany', translation: 'alemania' },
      { term: 'italy', translation: 'italia' },
      { term: 'china', translation: 'china' },
      { term: 'japan', translation: 'japón' },
      { term: 'brazil', translation: 'brasil' },
      { term: 'mexico', translation: 'méxico' },
      { term: 'canada', translation: 'canadá' },
      { term: 'russia', translation: 'rusia' },
      { term: 'india', translation: 'india' },
      { term: 'australia', translation: 'australia' },
      { term: 'egypt', translation: 'egipto' },
      { term: 'greece', translation: 'grecia' }
    ],
    spanish: [
      { term: 'españa', translation: 'spain' },
      { term: 'francia', translation: 'france' },
      { term: 'alemania', translation: 'germany' },
      { term: 'italia', translation: 'italy' },
      { term: 'china', translation: 'china' },
      { term: 'japón', translation: 'japan' },
      { term: 'brasil', translation: 'brazil' },
      { term: 'méxico', translation: 'mexico' },
      { term: 'canadá', translation: 'canada' },
      { term: 'rusia', translation: 'russia' },
      { term: 'india', translation: 'india' },
      { term: 'australia', translation: 'australia' },
      { term: 'egipto', translation: 'egypt' },
      { term: 'grecia', translation: 'greece' }
    ]
  },
  numbers: {
    english: [
      { term: 'one', translation: 'uno' },
      { term: 'two', translation: 'dos' },
      { term: 'three', translation: 'tres' },
      { term: 'four', translation: 'cuatro' },
      { term: 'five', translation: 'cinco' },
      { term: 'six', translation: 'seis' },
      { term: 'seven', translation: 'siete' },
      { term: 'eight', translation: 'ocho' },
      { term: 'nine', translation: 'nueve' },
      { term: 'ten', translation: 'diez' },
      { term: 'eleven', translation: 'once' },
      { term: 'twelve', translation: 'doce' },
      { term: 'thirteen', translation: 'trece' },
      { term: 'fourteen', translation: 'catorce' }
    ],
    spanish: [
      { term: 'uno', translation: 'one' },
      { term: 'dos', translation: 'two' },
      { term: 'tres', translation: 'three' },
      { term: 'cuatro', translation: 'four' },
      { term: 'cinco', translation: 'five' },
      { term: 'seis', translation: 'six' },
      { term: 'siete', translation: 'seven' },
      { term: 'ocho', translation: 'eight' },
      { term: 'nueve', translation: 'nine' },
      { term: 'diez', translation: 'ten' },
      { term: 'once', translation: 'eleven' },
      { term: 'doce', translation: 'twelve' },
      { term: 'trece', translation: 'thirteen' },
      { term: 'catorce', translation: 'fourteen' }
    ]
  },
  days: {
    english: [
      { term: 'Monday', translation: 'Lunes' },
      { term: 'Tuesday', translation: 'Martes' },
      { term: 'Wednesday', translation: 'Miércoles' },
      { term: 'Thursday', translation: 'Jueves' },
      { term: 'Friday', translation: 'Viernes' },
      { term: 'Saturday', translation: 'Sábado' },
      { term: 'Sunday', translation: 'Domingo' },
      { term: 'weekend', translation: 'fin de semana' },
      { term: 'weekday', translation: 'día de la semana' },
      { term: 'today', translation: 'hoy' },
      { term: 'tomorrow', translation: 'mañana' },
      { term: 'yesterday', translation: 'ayer' }
    ],
    spanish: [
      { term: 'Lunes', translation: 'Monday' },
      { term: 'Martes', translation: 'Tuesday' },
      { term: 'Miércoles', translation: 'Wednesday' },
      { term: 'Jueves', translation: 'Thursday' },
      { term: 'Viernes', translation: 'Friday' },
      { term: 'Sábado', translation: 'Saturday' },
      { term: 'Domingo', translation: 'Sunday' },
      { term: 'fin de semana', translation: 'weekend' },
      { term: 'día de la semana', translation: 'weekday' },
      { term: 'hoy', translation: 'today' },
      { term: 'mañana', translation: 'tomorrow' },
      { term: 'ayer', translation: 'yesterday' }
    ]
  },
  months: {
    english: [
      { term: 'January', translation: 'Enero' },
      { term: 'February', translation: 'Febrero' },
      { term: 'March', translation: 'Marzo' },
      { term: 'April', translation: 'Abril' },
      { term: 'May', translation: 'Mayo' },
      { term: 'June', translation: 'Junio' },
      { term: 'July', translation: 'Julio' },
      { term: 'August', translation: 'Agosto' },
      { term: 'September', translation: 'Septiembre' },
      { term: 'October', translation: 'Octubre' },
      { term: 'November', translation: 'Noviembre' },
      { term: 'December', translation: 'Diciembre' },
      { term: 'Spring', translation: 'Primavera' },
      { term: 'Summer', translation: 'Verano' },
      { term: 'Fall', translation: 'Otoño' },
      { term: 'Winter', translation: 'Invierno' }
    ],
    spanish: [
      { term: 'Enero', translation: 'January' },
      { term: 'Febrero', translation: 'February' },
      { term: 'Marzo', translation: 'March' },
      { term: 'Abril', translation: 'April' },
      { term: 'Mayo', translation: 'May' },
      { term: 'Junio', translation: 'June' },
      { term: 'Julio', translation: 'July' },
      { term: 'Agosto', translation: 'August' },
      { term: 'Septiembre', translation: 'September' },
      { term: 'Octubre', translation: 'October' },
      { term: 'Noviembre', translation: 'November' },
      { term: 'Diciembre', translation: 'December' },
      { term: 'Primavera', translation: 'Spring' },
      { term: 'Verano', translation: 'Summer' },
      { term: 'Otoño', translation: 'Fall' },
      { term: 'Invierno', translation: 'Winter' }
    ]
  },
  greetings: {
    english: [
      { term: 'Hello', translation: 'Hola' },
      { term: 'Goodbye', translation: 'Adiós' },
      { term: 'Good morning', translation: 'Buenos días' },
      { term: 'Good afternoon', translation: 'Buenas tardes' },
      { term: 'Good evening', translation: 'Buenas noches' },
      { term: 'Welcome', translation: 'Bienvenido' },
      { term: 'Nice to meet you', translation: 'Encantado de conocerte' },
      { term: 'How are you?', translation: '¿Cómo estás?' },
      { term: 'I am fine', translation: 'Estoy bien' },
      { term: 'Thank you', translation: 'Gracias' },
      { term: 'You\'re welcome', translation: 'De nada' },
      { term: 'See you later', translation: 'Hasta luego' }
    ],
    spanish: [
      { term: 'Hola', translation: 'Hello' },
      { term: 'Adiós', translation: 'Goodbye' },
      { term: 'Buenos días', translation: 'Good morning' },
      { term: 'Buenas tardes', translation: 'Good afternoon' },
      { term: 'Buenas noches', translation: 'Good evening' },
      { term: 'Bienvenido', translation: 'Welcome' },
      { term: 'Encantado de conocerte', translation: 'Nice to meet you' },
      { term: '¿Cómo estás?', translation: 'How are you?' },
      { term: 'Estoy bien', translation: 'I am fine' },
      { term: 'Gracias', translation: 'Thank you' },
      { term: 'De nada', translation: 'You\'re welcome' },
      { term: 'Hasta luego', translation: 'See you later' }
    ]
  },
  phrases: {
    english: [
      { term: 'I don\'t understand', translation: 'No entiendo' },
      { term: 'Can you help me?', translation: '¿Puedes ayudarme?' },
      { term: 'Where is the bathroom?', translation: '¿Dónde está el baño?' },
      { term: 'How much does it cost?', translation: '¿Cuánto cuesta?' },
      { term: 'I would like...', translation: 'Me gustaría...' },
      { term: 'What time is it?', translation: '¿Qué hora es?' },
      { term: 'I\'m sorry', translation: 'Lo siento' },
      { term: 'Excuse me', translation: 'Perdón' },
      { term: 'Can you speak slower?', translation: '¿Puedes hablar más despacio?' },
      { term: 'I like it', translation: 'Me gusta' }
    ],
    spanish: [
      { term: 'No entiendo', translation: 'I don\'t understand' },
      { term: '¿Puedes ayudarme?', translation: 'Can you help me?' },
      { term: '¿Dónde está el baño?', translation: 'Where is the bathroom?' },
      { term: '¿Cuánto cuesta?', translation: 'How much does it cost?' },
      { term: 'Me gustaría...', translation: 'I would like...' },
      { term: '¿Qué hora es?', translation: 'What time is it?' },
      { term: 'Lo siento', translation: 'I\'m sorry' },
      { term: 'Perdón', translation: 'Excuse me' },
      { term: '¿Puedes hablar más despacio?', translation: 'Can you speak slower?' },
      { term: 'Me gusta', translation: 'I like it' }
    ]
  },
  
  // People & Relationships Group
  family: {
    english: [
      { term: 'mother', translation: 'madre' },
      { term: 'father', translation: 'padre' },
      { term: 'sister', translation: 'hermana' },
      { term: 'brother', translation: 'hermano' },
      { term: 'son', translation: 'hijo' },
      { term: 'daughter', translation: 'hija' },
      { term: 'grandmother', translation: 'abuela' },
      { term: 'grandfather', translation: 'abuelo' },
      { term: 'aunt', translation: 'tía' },
      { term: 'uncle', translation: 'tío' },
      { term: 'cousin', translation: 'primo/a' },
      { term: 'husband', translation: 'esposo' },
      { term: 'wife', translation: 'esposa' },
      { term: 'parents', translation: 'padres' }
    ],
    spanish: [
      { term: 'madre', translation: 'mother' },
      { term: 'padre', translation: 'father' },
      { term: 'hermana', translation: 'sister' },
      { term: 'hermano', translation: 'brother' },
      { term: 'hijo', translation: 'son' },
      { term: 'hija', translation: 'daughter' },
      { term: 'abuela', translation: 'grandmother' },
      { term: 'abuelo', translation: 'grandfather' },
      { term: 'tía', translation: 'aunt' },
      { term: 'tío', translation: 'uncle' },
      { term: 'primo/a', translation: 'cousin' },
      { term: 'esposo', translation: 'husband' },
      { term: 'esposa', translation: 'wife' },
      { term: 'padres', translation: 'parents' }
    ]
  },
  physicaltraits: {
    english: [
      { term: 'tall', translation: 'alto' },
      { term: 'short', translation: 'bajo' },
      { term: 'thin', translation: 'delgado' },
      { term: 'fat', translation: 'gordo' },
      { term: 'strong', translation: 'fuerte' },
      { term: 'weak', translation: 'débil' },
      { term: 'beautiful', translation: 'hermoso' },
      { term: 'handsome', translation: 'guapo' },
      { term: 'young', translation: 'joven' },
      { term: 'old', translation: 'viejo' },
      { term: 'blonde hair', translation: 'pelo rubio' },
      { term: 'brown hair', translation: 'pelo castaño' },
      { term: 'blue eyes', translation: 'ojos azules' },
      { term: 'green eyes', translation: 'ojos verdes' }
    ],
    spanish: [
      { term: 'alto', translation: 'tall' },
      { term: 'bajo', translation: 'short' },
      { term: 'delgado', translation: 'thin' },
      { term: 'gordo', translation: 'fat' },
      { term: 'fuerte', translation: 'strong' },
      { term: 'débil', translation: 'weak' },
      { term: 'hermoso', translation: 'beautiful' },
      { term: 'guapo', translation: 'handsome' },
      { term: 'joven', translation: 'young' },
      { term: 'viejo', translation: 'old' },
      { term: 'pelo rubio', translation: 'blonde hair' },
      { term: 'pelo castaño', translation: 'brown hair' },
      { term: 'ojos azules', translation: 'blue eyes' },
      { term: 'ojos verdes', translation: 'green eyes' }
    ]
  },
  personality: {
    english: [
      { term: 'friendly', translation: 'amistoso' },
      { term: 'shy', translation: 'tímido' },
      { term: 'brave', translation: 'valiente' },
      { term: 'intelligent', translation: 'inteligente' },
      { term: 'funny', translation: 'gracioso' },
      { term: 'serious', translation: 'serio' },
      { term: 'creative', translation: 'creativo' },
      { term: 'kind', translation: 'amable' },
      { term: 'honest', translation: 'honesto' },
      { term: 'patient', translation: 'paciente' },
      { term: 'impatient', translation: 'impaciente' },
      { term: 'generous', translation: 'generoso' }
    ],
    spanish: [
      { term: 'amistoso', translation: 'friendly' },
      { term: 'tímido', translation: 'shy' },
      { term: 'valiente', translation: 'brave' },
      { term: 'inteligente', translation: 'intelligent' },
      { term: 'gracioso', translation: 'funny' },
      { term: 'serio', translation: 'serious' },
      { term: 'creativo', translation: 'creative' },
      { term: 'amable', translation: 'kind' },
      { term: 'honesto', translation: 'honest' },
      { term: 'paciente', translation: 'patient' },
      { term: 'impaciente', translation: 'impatient' },
      { term: 'generoso', translation: 'generous' }
    ]
  },
  professions: {
    english: [
      { term: 'doctor', translation: 'médico' },
      { term: 'teacher', translation: 'profesor' },
      { term: 'engineer', translation: 'ingeniero' },
      { term: 'police officer', translation: 'policía' },
      { term: 'firefighter', translation: 'bombero' },
      { term: 'chef', translation: 'cocinero' },
      { term: 'nurse', translation: 'enfermero' },
      { term: 'artist', translation: 'artista' },
      { term: 'lawyer', translation: 'abogado' },
      { term: 'writer', translation: 'escritor' },
      { term: 'musician', translation: 'músico' },
      { term: 'scientist', translation: 'científico' }
    ],
    spanish: [
      { term: 'médico', translation: 'doctor' },
      { term: 'profesor', translation: 'teacher' },
      { term: 'ingeniero', translation: 'engineer' },
      { term: 'policía', translation: 'police officer' },
      { term: 'bombero', translation: 'firefighter' },
      { term: 'cocinero', translation: 'chef' },
      { term: 'enfermero', translation: 'nurse' },
      { term: 'artista', translation: 'artist' },
      { term: 'abogado', translation: 'lawyer' },
      { term: 'escritor', translation: 'writer' },
      { term: 'músico', translation: 'musician' },
      { term: 'científico', translation: 'scientist' }
    ]
  },
  
  // Home & Daily Life Group
  household: {
    english: [
      { term: 'table', translation: 'mesa' },
      { term: 'chair', translation: 'silla' },
      { term: 'bed', translation: 'cama' },
      { term: 'sofa', translation: 'sofá' },
      { term: 'television', translation: 'televisión' },
      { term: 'refrigerator', translation: 'refrigerador' },
      { term: 'stove', translation: 'estufa' },
      { term: 'lamp', translation: 'lámpara' },
      { term: 'window', translation: 'ventana' },
      { term: 'door', translation: 'puerta' },
      { term: 'mirror', translation: 'espejo' },
      { term: 'shower', translation: 'ducha' }
    ],
    spanish: [
      { term: 'mesa', translation: 'table' },
      { term: 'silla', translation: 'chair' },
      { term: 'cama', translation: 'bed' },
      { term: 'sofá', translation: 'sofa' },
      { term: 'televisión', translation: 'television' },
      { term: 'refrigerador', translation: 'refrigerator' },
      { term: 'estufa', translation: 'stove' },
      { term: 'lámpara', translation: 'lamp' },
      { term: 'ventana', translation: 'window' },
      { term: 'puerta', translation: 'door' },
      { term: 'espejo', translation: 'mirror' },
      { term: 'ducha', translation: 'shower' }
    ]
  },
  rooms: {
    english: [
      { term: 'kitchen', translation: 'cocina' },
      { term: 'bathroom', translation: 'baño' },
      { term: 'bedroom', translation: 'dormitorio' },
      { term: 'living room', translation: 'sala de estar' },
      { term: 'dining room', translation: 'comedor' },
      { term: 'garage', translation: 'garaje' },
      { term: 'basement', translation: 'sótano' },
      { term: 'attic', translation: 'ático' },
      { term: 'garden', translation: 'jardín' },
      { term: 'office', translation: 'oficina' }
    ],
    spanish: [
      { term: 'cocina', translation: 'kitchen' },
      { term: 'baño', translation: 'bathroom' },
      { term: 'dormitorio', translation: 'bedroom' },
      { term: 'sala de estar', translation: 'living room' },
      { term: 'comedor', translation: 'dining room' },
      { term: 'garaje', translation: 'garage' },
      { term: 'sótano', translation: 'basement' },
      { term: 'ático', translation: 'attic' },
      { term: 'jardín', translation: 'garden' },
      { term: 'oficina', translation: 'office' }
    ]
  },
  routines: {
    english: [
      { term: 'wake up', translation: 'despertar' },
      { term: 'brush teeth', translation: 'cepillarse los dientes' },
      { term: 'take a shower', translation: 'tomar una ducha' },
      { term: 'get dressed', translation: 'vestirse' },
      { term: 'eat breakfast', translation: 'desayunar' },
      { term: 'go to work', translation: 'ir al trabajo' },
      { term: 'cook lunch', translation: 'cocinar el almuerzo' },
      { term: 'clean the house', translation: 'limpiar la casa' },
      { term: 'wash dishes', translation: 'lavar los platos' },
      { term: 'go to sleep', translation: 'ir a dormir' }
    ],
    spanish: [
      { term: 'despertar', translation: 'wake up' },
      { term: 'cepillarse los dientes', translation: 'brush teeth' },
      { term: 'tomar una ducha', translation: 'take a shower' },
      { term: 'vestirse', translation: 'get dressed' },
      { term: 'desayunar', translation: 'eat breakfast' },
      { term: 'ir al trabajo', translation: 'go to work' },
      { term: 'cocinar el almuerzo', translation: 'cook lunch' },
      { term: 'limpiar la casa', translation: 'clean the house' },
      { term: 'lavar los platos', translation: 'wash dishes' },
      { term: 'ir a dormir', translation: 'go to sleep' }
    ]
  },
  
  // Food & Drinks Group
  foods: {
    english: [
      { term: 'pizza', translation: 'pizza' },
      { term: 'sandwich', translation: 'sándwich' },
      { term: 'hamburger', translation: 'hamburguesa' },
      { term: 'chicken', translation: 'pollo' },
      { term: 'steak', translation: 'bistec' },
      { term: 'pasta', translation: 'pasta' },
      { term: 'soup', translation: 'sopa' },
      { term: 'salad', translation: 'ensalada' },
      { term: 'cake', translation: 'pastel' },
      { term: 'ice cream', translation: 'helado' },
      { term: 'cookies', translation: 'galletas' },
      { term: 'chocolate', translation: 'chocolate' }
    ],
    spanish: [
      { term: 'pizza', translation: 'pizza' },
      { term: 'sándwich', translation: 'sandwich' },
      { term: 'hamburguesa', translation: 'hamburger' },
      { term: 'pollo', translation: 'chicken' },
      { term: 'bistec', translation: 'steak' },
      { term: 'pasta', translation: 'pasta' },
      { term: 'sopa', translation: 'soup' },
      { term: 'ensalada', translation: 'salad' },
      { term: 'pastel', translation: 'cake' },
      { term: 'helado', translation: 'ice cream' },
      { term: 'galletas', translation: 'cookies' },
      { term: 'chocolate', translation: 'chocolate' }
    ]
  },
  drinks: {
    english: [
      { term: 'water', translation: 'agua' },
      { term: 'coffee', translation: 'café' },
      { term: 'tea', translation: 'té' },
      { term: 'juice', translation: 'jugo' },
      { term: 'milk', translation: 'leche' },
      { term: 'soda', translation: 'refresco' },
      { term: 'beer', translation: 'cerveza' },
      { term: 'wine', translation: 'vino' },
      { term: 'cocktail', translation: 'cóctel' },
      { term: 'lemonade', translation: 'limonada' }
    ],
    spanish: [
      { term: 'agua', translation: 'water' },
      { term: 'café', translation: 'coffee' },
      { term: 'té', translation: 'tea' },
      { term: 'jugo', translation: 'juice' },
      { term: 'leche', translation: 'milk' },
      { term: 'refresco', translation: 'soda' },
      { term: 'cerveza', translation: 'beer' },
      { term: 'vino', translation: 'wine' },
      { term: 'cóctel', translation: 'cocktail' },
      { term: 'limonada', translation: 'lemonade' }
    ]
  },
  fruitsveg: {
    english: [
      { term: 'apple', translation: 'manzana' },
      { term: 'banana', translation: 'plátano' },
      { term: 'orange', translation: 'naranja' },
      { term: 'strawberry', translation: 'fresa' },
      { term: 'grape', translation: 'uva' },
      { term: 'watermelon', translation: 'sandía' },
      { term: 'tomato', translation: 'tomate' },
      { term: 'potato', translation: 'patata' },
      { term: 'carrot', translation: 'zanahoria' },
      { term: 'broccoli', translation: 'brócoli' },
      { term: 'onion', translation: 'cebolla' },
      { term: 'lettuce', translation: 'lechuga' }
    ],
    spanish: [
      { term: 'manzana', translation: 'apple' },
      { term: 'plátano', translation: 'banana' },
      { term: 'naranja', translation: 'orange' },
      { term: 'fresa', translation: 'strawberry' },
      { term: 'uva', translation: 'grape' },
      { term: 'sandía', translation: 'watermelon' },
      { term: 'tomate', translation: 'tomato' },
      { term: 'patata', translation: 'potato' },
      { term: 'zanahoria', translation: 'carrot' },
      { term: 'brócoli', translation: 'broccoli' },
      { term: 'cebolla', translation: 'onion' },
      { term: 'lechuga', translation: 'lettuce' }
    ]
  },
  restaurant: {
    english: [
      { term: 'menu', translation: 'menú' },
      { term: 'waiter', translation: 'camarero' },
      { term: 'table', translation: 'mesa' },
      { term: 'reservation', translation: 'reserva' },
      { term: 'bill', translation: 'cuenta' },
      { term: 'tip', translation: 'propina' },
      { term: 'appetizer', translation: 'aperitivo' },
      { term: 'main course', translation: 'plato principal' },
      { term: 'dessert', translation: 'postre' },
      { term: 'delicious', translation: 'delicioso' }
    ],
    spanish: [
      { term: 'menú', translation: 'menu' },
      { term: 'camarero', translation: 'waiter' },
      { term: 'mesa', translation: 'table' },
      { term: 'reserva', translation: 'reservation' },
      { term: 'cuenta', translation: 'bill' },
      { term: 'propina', translation: 'tip' },
      { term: 'aperitivo', translation: 'appetizer' },
      { term: 'plato principal', translation: 'main course' },
      { term: 'postre', translation: 'dessert' },
      { term: 'delicioso', translation: 'delicious' }
    ]
  },
  
  // Travel & Transportation Group
  directions: {
    english: [
      { term: 'left', translation: 'izquierda' },
      { term: 'right', translation: 'derecha' },
      { term: 'straight', translation: 'recto' },
      { term: 'turn', translation: 'giro' },
      { term: 'north', translation: 'norte' },
      { term: 'south', translation: 'sur' },
      { term: 'east', translation: 'este' },
      { term: 'west', translation: 'oeste' },
      { term: 'map', translation: 'mapa' },
      { term: 'street', translation: 'calle' },
      { term: 'avenue', translation: 'avenida' },
      { term: 'intersection', translation: 'intersección' }
    ],
    spanish: [
      { term: 'izquierda', translation: 'left' },
      { term: 'derecha', translation: 'right' },
      { term: 'recto', translation: 'straight' },
      { term: 'giro', translation: 'turn' },
      { term: 'norte', translation: 'north' },
      { term: 'sur', translation: 'south' },
      { term: 'este', translation: 'east' },
      { term: 'oeste', translation: 'west' },
      { term: 'mapa', translation: 'map' },
      { term: 'calle', translation: 'street' },
      { term: 'avenida', translation: 'avenue' },
      { term: 'intersección', translation: 'intersection' }
    ]
  },
  transport: {
    english: [
      { term: 'car', translation: 'coche' },
      { term: 'bus', translation: 'autobús' },
      { term: 'train', translation: 'tren' },
      { term: 'airplane', translation: 'avión' },
      { term: 'subway', translation: 'metro' },
      { term: 'bicycle', translation: 'bicicleta' },
      { term: 'taxi', translation: 'taxi' },
      { term: 'boat', translation: 'barco' },
      { term: 'motorcycle', translation: 'motocicleta' },
      { term: 'helicopter', translation: 'helicóptero' }
    ],
    spanish: [
      { term: 'coche', translation: 'car' },
      { term: 'autobús', translation: 'bus' },
      { term: 'tren', translation: 'train' },
      { term: 'avión', translation: 'airplane' },
      { term: 'metro', translation: 'subway' },
      { term: 'bicicleta', translation: 'bicycle' },
      { term: 'taxi', translation: 'taxi' },
      { term: 'barco', translation: 'boat' },
      { term: 'motocicleta', translation: 'motorcycle' },
      { term: 'helicóptero', translation: 'helicopter' }
    ]
  },
  
  // Nature & Environment Group
  weather: {
    english: [
      { term: 'sunny', translation: 'soleado' },
      { term: 'rainy', translation: 'lluvioso' },
      { term: 'cloudy', translation: 'nublado' },
      { term: 'windy', translation: 'ventoso' },
      { term: 'snow', translation: 'nieve' },
      { term: 'storm', translation: 'tormenta' },
      { term: 'fog', translation: 'niebla' },
      { term: 'hot', translation: 'caliente' },
      { term: 'cold', translation: 'frío' },
      { term: 'humid', translation: 'húmedo' },
      { term: 'temperature', translation: 'temperatura' },
      { term: 'forecast', translation: 'pronóstico' }
    ],
    spanish: [
      { term: 'soleado', translation: 'sunny' },
      { term: 'lluvioso', translation: 'rainy' },
      { term: 'nublado', translation: 'cloudy' },
      { term: 'ventoso', translation: 'windy' },
      { term: 'nieve', translation: 'snow' },
      { term: 'tormenta', translation: 'storm' },
      { term: 'niebla', translation: 'fog' },
      { term: 'caliente', translation: 'hot' },
      { term: 'frío', translation: 'cold' },
      { term: 'húmedo', translation: 'humid' },
      { term: 'temperatura', translation: 'temperature' },
      { term: 'pronóstico', translation: 'forecast' }
    ]
  },
  plants: {
    english: [
      { term: 'tree', translation: 'árbol' },
      { term: 'flower', translation: 'flor' },
      { term: 'grass', translation: 'hierba' },
      { term: 'bush', translation: 'arbusto' },
      { term: 'leaf', translation: 'hoja' },
      { term: 'root', translation: 'raíz' },
      { term: 'seed', translation: 'semilla' },
      { term: 'cactus', translation: 'cactus' },
      { term: 'rose', translation: 'rosa' },
      { term: 'sunflower', translation: 'girasol' },
      { term: 'oak', translation: 'roble' },
      { term: 'pine', translation: 'pino' }
    ],
    spanish: [
      { term: 'árbol', translation: 'tree' },
      { term: 'flor', translation: 'flower' },
      { term: 'hierba', translation: 'grass' },
      { term: 'arbusto', translation: 'bush' },
      { term: 'hoja', translation: 'leaf' },
      { term: 'raíz', translation: 'root' },
      { term: 'semilla', translation: 'seed' },
      { term: 'cactus', translation: 'cactus' },
      { term: 'rosa', translation: 'rose' },
      { term: 'girasol', translation: 'sunflower' },
      { term: 'roble', translation: 'oak' },
      { term: 'pino', translation: 'pine' }
    ]
  },
  
  // These are the original topics for backwards compatibility
  food: {
    // ... existing code ...
  }
};

// Add fallback vocabulary for each language
const FALLBACK_VOCABULARY: Record<string, Array<{term: string, translation: string, isImage: boolean}>> = {
  english: [
    { term: 'hello', translation: 'hola', isImage: false },
    { term: 'goodbye', translation: 'adiós', isImage: false },
    { term: 'thank you', translation: 'gracias', isImage: false },
    { term: 'please', translation: 'por favor', isImage: false },
    { term: 'yes', translation: 'sí', isImage: false },
    { term: 'no', translation: 'no', isImage: false },
    { term: 'water', translation: 'agua', isImage: false },
    { term: 'food', translation: 'comida', isImage: false },
    { term: 'morning', translation: 'mañana', isImage: false },
    { term: 'night', translation: 'noche', isImage: false },
  ],
  spanish: [
    { term: 'hola', translation: 'hello', isImage: false },
    { term: 'adiós', translation: 'goodbye', isImage: false },
    { term: 'gracias', translation: 'thank you', isImage: false },
    { term: 'por favor', translation: 'please', isImage: false },
    { term: 'sí', translation: 'yes', isImage: false },
    { term: 'no', translation: 'no', isImage: false },
    { term: 'agua', translation: 'water', isImage: false },
    { term: 'comida', translation: 'food', isImage: false },
    { term: 'mañana', translation: 'morning', isImage: false },
    { term: 'noche', translation: 'night', isImage: false },
  ],
  french: [
    { term: 'bonjour', translation: 'hello', isImage: false },
    { term: 'au revoir', translation: 'goodbye', isImage: false },
    { term: 'merci', translation: 'thank you', isImage: false },
    { term: 's\'il vous plaît', translation: 'please', isImage: false },
    { term: 'oui', translation: 'yes', isImage: false },
    { term: 'non', translation: 'no', isImage: false },
    { term: 'eau', translation: 'water', isImage: false },
    { term: 'nourriture', translation: 'food', isImage: false },
    { term: 'matin', translation: 'morning', isImage: false },
    { term: 'nuit', translation: 'night', isImage: false },
  ],
  german: [
    { term: 'hallo', translation: 'hello', isImage: false },
    { term: 'auf wiedersehen', translation: 'goodbye', isImage: false },
    { term: 'danke', translation: 'thank you', isImage: false },
    { term: 'bitte', translation: 'please', isImage: false },
    { term: 'ja', translation: 'yes', isImage: false },
    { term: 'nein', translation: 'no', isImage: false },
    { term: 'wasser', translation: 'water', isImage: false },
    { term: 'essen', translation: 'food', isImage: false },
    { term: 'morgen', translation: 'morning', isImage: false },
    { term: 'nacht', translation: 'night', isImage: false },
  ],
  italian: [
    { term: 'ciao', translation: 'hello', isImage: false },
    { term: 'arrivederci', translation: 'goodbye', isImage: false },
    { term: 'grazie', translation: 'thank you', isImage: false },
    { term: 'per favore', translation: 'please', isImage: false },
    { term: 'sì', translation: 'yes', isImage: false },
    { term: 'no', translation: 'no', isImage: false },
    { term: 'acqua', translation: 'water', isImage: false },
    { term: 'cibo', translation: 'food', isImage: false },
    { term: 'mattina', translation: 'morning', isImage: false },
    { term: 'notte', translation: 'night', isImage: false },
  ],
  portuguese: [
    { term: 'olá', translation: 'hello', isImage: false },
    { term: 'adeus', translation: 'goodbye', isImage: false },
    { term: 'obrigado', translation: 'thank you', isImage: false },
    { term: 'por favor', translation: 'please', isImage: false },
    { term: 'sim', translation: 'yes', isImage: false },
    { term: 'não', translation: 'no', isImage: false },
    { term: 'água', translation: 'water', isImage: false },
    { term: 'comida', translation: 'food', isImage: false },
    { term: 'manhã', translation: 'morning', isImage: false },
    { term: 'noite', translation: 'night', isImage: false },
  ],
  chinese: [
    { term: '你好 (nǐ hǎo)', translation: 'hello', isImage: false },
    { term: '再见 (zài jiàn)', translation: 'goodbye', isImage: false },
    { term: '谢谢 (xiè xiè)', translation: 'thank you', isImage: false },
    { term: '请 (qǐng)', translation: 'please', isImage: false },
    { term: '是 (shì)', translation: 'yes', isImage: false },
    { term: '不 (bù)', translation: 'no', isImage: false },
    { term: '水 (shuǐ)', translation: 'water', isImage: false },
    { term: '食物 (shí wù)', translation: 'food', isImage: false },
    { term: '早上 (zǎo shang)', translation: 'morning', isImage: false },
    { term: '晚上 (wǎn shang)', translation: 'night', isImage: false },
  ],
  japanese: [
    { term: 'こんにちは (konnichiwa)', translation: 'hello', isImage: false },
    { term: 'さようなら (sayōnara)', translation: 'goodbye', isImage: false },
    { term: 'ありがとう (arigatō)', translation: 'thank you', isImage: false },
    { term: 'お願いします (onegaishimasu)', translation: 'please', isImage: false },
    { term: 'はい (hai)', translation: 'yes', isImage: false },
    { term: 'いいえ (iie)', translation: 'no', isImage: false },
    { term: '水 (mizu)', translation: 'water', isImage: false },
    { term: '食べ物 (tabemono)', translation: 'food', isImage: false },
    { term: '朝 (asa)', translation: 'morning', isImage: false },
    { term: '夜 (yoru)', translation: 'night', isImage: false },
  ],
  korean: [
    { term: '안녕하세요 (annyeonghaseyo)', translation: 'hello', isImage: false },
    { term: '안녕히 가세요 (annyeonghi gaseyo)', translation: 'goodbye', isImage: false },
    { term: '감사합니다 (gamsahamnida)', translation: 'thank you', isImage: false },
    { term: '부탁합니다 (butakhamnida)', translation: 'please', isImage: false },
    { term: '네 (ne)', translation: 'yes', isImage: false },
    { term: '아니요 (aniyo)', translation: 'no', isImage: false },
    { term: '물 (mul)', translation: 'water', isImage: false },
    { term: '음식 (eumsik)', translation: 'food', isImage: false },
    { term: '아침 (achim)', translation: 'morning', isImage: false },
    { term: '밤 (bam)', translation: 'night', isImage: false },
  ],
  arabic: [
    { term: "مرحبا (marhaban)", translation: "hello", isImage: false },
    { term: "مع السلامة (ma'a as-salāma)", translation: "goodbye", isImage: false },
    { term: "شكرا (shukran)", translation: "thank you", isImage: false },
    { term: "من فضلك (min fadlik)", translation: "please", isImage: false },
    { term: "نعم (na'am)", translation: "yes", isImage: false },
    { term: "لا (la)", translation: "no", isImage: false },
    { term: "ماء (ma')", translation: "water", isImage: false },
    { term: "طعام (ta'am)", translation: "food", isImage: false },
    { term: "صباح (sabah)", translation: "morning", isImage: false },
    { term: "ليل (layl)", translation: "night", isImage: false },
  ],
  russian: [
    { term: 'привет (privet)', translation: 'hello', isImage: false },
    { term: 'до свидания (do svidaniya)', translation: 'goodbye', isImage: false },
    { term: 'спасибо (spasibo)', translation: 'thank you', isImage: false },
    { term: 'пожалуйста (pozhaluysta)', translation: 'please', isImage: false },
    { term: 'да (da)', translation: 'yes', isImage: false },
    { term: 'нет (nyet)', translation: 'no', isImage: false },
    { term: 'вода (voda)', translation: 'water', isImage: false },
    { term: 'еда (yeda)', translation: 'food', isImage: false },
    { term: 'утро (utro)', translation: 'morning', isImage: false },
    { term: 'ночь (noch)', translation: 'night', isImage: false },
  ]
};

// Background themes
const THEMES = [
  { name: 'Default', path: '/games/memory-game/backgrounds/default.jpg' },
  { name: 'Spanish Theme', path: '/games/memory-game/backgrounds/everything spanish.jpg' },
  { name: 'French Theme', path: '/games/memory-game/backgrounds/everything france.jpg' },
  { name: 'Classroom', path: '/games/memory-game/backgrounds/typical classroom.jpg' },
  { name: 'Forest', path: '/games/memory-game/backgrounds/forest.jpg' },
  { name: 'Temple', path: '/games/memory-game/backgrounds/temple_of_chaos.jpg' },
  { name: 'Cave', path: '/games/memory-game/backgrounds/cave_of_memories.jpg' }
];

// Card data structure
interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
  pairId: number;
  isImage: boolean;
}

// Add these constants for the settings modal
// Available languages and topics (same as in LanguageTopicSelector)
const LANGUAGES = [
  { code: 'english', name: 'English' },
  { code: 'spanish', name: 'Spanish' },
  { code: 'french', name: 'French' },
  { code: 'german', name: 'German' },
  { code: 'italian', name: 'Italian' },
  { code: 'portuguese', name: 'Portuguese' },
  { code: 'chinese', name: 'Chinese' },
  { code: 'japanese', name: 'Japanese' },
  { code: 'korean', name: 'Korean' },
  { code: 'arabic', name: 'Arabic' },
  { code: 'russian', name: 'Russian' }
];

const TOPICS = [
  { code: 'animals', name: 'Animals' },
  { code: 'colors', name: 'Colors' },
  { code: 'food', name: 'Food' },
  { code: 'countries', name: 'Countries' },
  { code: 'numbers', name: 'Numbers' },
  { code: 'custom', name: 'Custom' }
];

const DIFFICULTIES = [
  { code: 'easy-1', name: 'Easy (3×2)', pairs: 3, grid: '3x2' },
  { code: 'easy-2', name: 'Easy (4×2)', pairs: 4, grid: '4x2' },
  { code: 'medium-1', name: 'Medium (5×2)', pairs: 5, grid: '5x2' },
  { code: 'medium-2', name: 'Medium (4×3)', pairs: 6, grid: '4x3' },
  { code: 'hard-2', name: 'Hard (4×4)', pairs: 8, grid: '4x4' },
  { code: 'expert', name: 'Expert (5×4)', pairs: 10, grid: '5x4' }
];

export default function MemoryGameMain({ language, topic, difficulty, onBackToSettings, customWords }: MemoryGameMainProps) {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Audio refs
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Add state for current game settings
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTopic, setCurrentTopic] = useState(topic);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  // Add state for custom words
  const [currentCustomWords, setCurrentCustomWords] = useState<WordPair[]>(customWords || []);
  
  // Initialize game
  useEffect(() => {
    // Initialize audio
    correctSoundRef.current = new Audio('/games/memory-game/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/games/memory-game/sounds/wrong.mp3');
    winSoundRef.current = new Audio('/games/memory-game/sounds/win.mp3');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('memoryGameTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setSelectedTheme(parsedTheme);
      } catch (e) {
        console.error('Error loading saved theme:', e);
      }
    }
    
    // Initialize cards
    initializeGame();
    
    // Cleanup on unmount
    return () => {
      correctSoundRef.current = null;
      wrongSoundRef.current = null;
      winSoundRef.current = null;
    };
  }, [currentLanguage, currentTopic, currentDifficulty, currentCustomWords]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameContainerRef.current?.requestFullscreen) {
        gameContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Error attempting to enable fullscreen:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('Error attempting to exit fullscreen:', err));
      }
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Helper to calculate grid columns based on number of cards
  const calculateGridLayout = (totalCards: number, difficulty: string) => {
    // For custom words: create an appropriate grid layout
    if (currentCustomWords && currentCustomWords.length > 0) {
      const totalPairs = currentCustomWords.length;
      
      // For custom words, use grid layouts matching our difficulty patterns
      if (totalPairs <= 3) return { cols: 3, rows: 2 }; // 3 pairs (6 cards) in 3x2
      if (totalPairs <= 4) return { cols: 4, rows: 2 }; // 4 pairs (8 cards) in 4x2
      if (totalPairs <= 5) return { cols: 5, rows: 2 }; // 5 pairs (10 cards) in 5x2
      if (totalPairs <= 6) return { cols: 4, rows: 3 }; // 6 pairs (12 cards) in 4x3
      if (totalPairs <= 8) return { cols: 4, rows: 4 }; // 8 pairs (16 cards) in 4x4
      if (totalPairs <= 10) return { cols: 5, rows: 4 }; // 10 pairs (20 cards) in 5x4
      
      // For larger custom sets, calculate a reasonable square-ish layout
      return { cols: Math.ceil(Math.sqrt(totalPairs * 2)), rows: Math.ceil(Math.sqrt(totalPairs * 2)) };
    }
    
    // For predefined difficulty levels
    switch (difficulty) {
      case 'easy-1':
        return { cols: 3, rows: 2 }; // 3 pairs (6 cards)
      case 'easy-2':
        return { cols: 4, rows: 2 }; // 4 pairs (8 cards)
      case 'medium-1':
        return { cols: 5, rows: 2 }; // 5 pairs (10 cards)
      case 'medium-2':
        return { cols: 4, rows: 3 }; // 6 pairs (12 cards)
      case 'hard-2':
        return { cols: 4, rows: 4 }; // 8 pairs (16 cards)
      case 'expert':
        return { cols: 5, rows: 4 }; // 10 pairs (20 cards)
      default:
        return { cols: 4, rows: 3 }; // Default to medium size
    }
  };
  
  // Initialize the game with cards
  const initializeGame = () => {
    let totalPairs = 0;
    let wordPairs: any[] = [];
    
    // Determine number of pairs based on difficulty or custom words
    if (currentCustomWords && currentCustomWords.length > 0) {
      // Use all custom words
      wordPairs = currentCustomWords.map(pair => {
        if (pair.type === 'image') {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: true
          };
        } else {
          return {
            term: pair.term,
            translation: pair.translation,
            isImage: false
          };
        }
      });
      
      totalPairs = wordPairs.length;
    } else {
      // Use predefined vocabulary based on difficulty
      if (VOCABULARY[currentTopic] && VOCABULARY[currentTopic][currentLanguage]) {
        const vocabList = VOCABULARY[currentTopic][currentLanguage];
        
        // Determine number of pairs based on difficulty
        switch (currentDifficulty) {
          case 'easy-1':
            totalPairs = 3;
            break;
          case 'easy-2':
            totalPairs = 4;
            break;
          case 'medium-1':
            totalPairs = 5;
            break;
          case 'medium-2':
            totalPairs = 6;
            break;
          case 'hard-2':
            totalPairs = 8;
            break;
          case 'expert':
            totalPairs = 10;
            break;
          default:
            totalPairs = 6; // Default to medium
            break;
        }
        
        // Get words up to the required number of pairs
        wordPairs = vocabList.slice(0, totalPairs);
        
        // If not enough pairs, duplicate some
        while (wordPairs.length < totalPairs) {
          const remaining = totalPairs - wordPairs.length;
          wordPairs = [...wordPairs, ...vocabList.slice(0, Math.min(remaining, vocabList.length))];
        }
      } else {
        // If specific topic/language combination not found, use fallback vocabulary for the current language
        const fallbackVocab = FALLBACK_VOCABULARY[currentLanguage] || FALLBACK_VOCABULARY.english;
        wordPairs = fallbackVocab;
        
        // Use appropriate number of pairs for the difficulty
        switch (currentDifficulty) {
          case 'easy-1': totalPairs = 3; break;
          case 'easy-2': totalPairs = 4; break;
          case 'medium-1': totalPairs = 5; break;
          case 'medium-2': totalPairs = 6; break;
          case 'hard-2': totalPairs = 8; break;
          case 'expert': totalPairs = 10; break;
          default: totalPairs = 6; break;
        }
        
        // Limit to available pairs
        totalPairs = Math.min(fallbackVocab.length, totalPairs);
      }
    }
    
    // Create card pairs
    const newCards: Card[] = [];
    
    // Limit to the determined number of pairs
    wordPairs = wordPairs.slice(0, totalPairs);
    
    // Create card pairs (term and translation cards)
    wordPairs.forEach((pair, index) => {
      // First card (term)
      newCards.push({
        id: index * 2,
        value: pair.term,
        isImage: pair.isImage && pair.type === 'image',
        flipped: false,
        matched: false,
        pairId: index
      });
      
      // Second card (translation)
      newCards.push({
        id: index * 2 + 1,
        value: pair.translation,
        isImage: pair.isImage && pair.type === 'image',
        flipped: false,
        matched: false,
        pairId: index
      });
    });
    
    // Shuffle the cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    setCards(newCards);
    setMatches(0);
    setAttempts(0);
    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
    setGameWon(false);
  };
  
  // Handle card click
  const handleCardClick = (card: Card) => {
    // Ignore if can't flip or card is already flipped/matched
    if (!canFlip || card.flipped || card.matched) {
      return;
    }
    
    // Flip the card
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(updatedCards);
    
    // If it's the first card
    if (!firstCard) {
      setFirstCard(card);
      return;
    }
    
    // If it's the second card
    setSecondCard(card);
    setCanFlip(false);
    setAttempts(attempts + 1);
    
    // Check for match
    if (firstCard.pairId === card.pairId) {
      // It's a match
      if (correctSoundRef.current) {
        correctSoundRef.current.play();
      }
      
      setTimeout(() => {
        // Mark both cards as matched
        const matchedCards = cards.map(c => 
          c.pairId === firstCard.pairId ? { ...c, matched: true, flipped: true } : c
        );
        setCards(matchedCards);
        setFirstCard(null);
        setSecondCard(null);
        setCanFlip(true);
        setMatches(matches + 1);
        
        // Check for win condition
        const totalPairs = cards.length / 2;
        if (matches + 1 === totalPairs) {
          setGameWon(true);
          if (winSoundRef.current) {
            winSoundRef.current.play();
          }
        }
      }, 500);
    } else {
      // Not a match
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play();
      }
      
      setTimeout(() => {
        const resetCards = cards.map(c => 
          (c.id === firstCard.id || c.id === card.id) ? { ...c, flipped: false } : c
        );
        setCards(resetCards);
        setFirstCard(null);
        setSecondCard(null);
        setCanFlip(true);
      }, 1000);
    }
  };
  
  // Reset game
  const resetGame = () => {
    initializeGame();
    setGameWon(false);
  };
  
  // Toggle theme modal
  const toggleThemeModal = () => {
    setShowThemeModal(!showThemeModal);
  };
  
  // Select theme
  const selectTheme = (theme: any) => {
    setSelectedTheme(theme);
    localStorage.setItem('memoryGameTheme', JSON.stringify(theme));
    toggleThemeModal();
  };
  
  // Toggle settings modal
  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };
  
  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };
  
  // Handle topic change
  const handleTopicChange = (newTopic: string) => {
    setCurrentTopic(newTopic);
    
    // If custom topic is selected, show the custom words modal
    if (newTopic.toLowerCase() === 'custom') {
      setShowSettingsModal(false);
      setShowCustomModal(true);
    }
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: string) => {
    setCurrentDifficulty(newDifficulty);
  };
  
  // Handle custom words submission
  const handleCustomWordsSubmit = (wordPairs: WordPair[]) => {
    setCurrentCustomWords(wordPairs);
    setShowCustomModal(false);
    // Start the game with the custom words
    resetGame();
  };
  
  // Get the optimal grid layout for the current cards
  const gridLayout = calculateGridLayout(cards.length, currentDifficulty);
  
  return (
    <div 
      className="game-wrapper"
      style={{
        backgroundImage: `url(${selectedTheme.path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      ref={gameContainerRef}
    >
      <header className="header">
        <div className="header-content">
          <div className="left-controls">
            <button onClick={onBackToSettings} className="nav-btn">
              <i className="fas fa-home"></i>
            </button>
            <button onClick={toggleThemeModal} className="nav-btn">
              <i className="fas fa-palette"></i> Theme
            </button>
            <button onClick={toggleSettingsModal} className="nav-btn">
              <i className="fas fa-cog"></i> Settings
            </button>
          </div>

          <h1 className="title">Memory Match</h1>

          <div className="right-controls">
            <div className="stats-group">
              <div className="stat-item">
                <i className="fas fa-star"></i>
                <span>Matches: <span id="matchCount">{matches}</span></span>
              </div>
              <div className="stat-item">
                <i className="fas fa-redo"></i>
                <span>Attempts: <span id="attempts">{attempts}</span></span>
              </div>
            </div>
            <button onClick={toggleFullscreen} className="nav-btn">
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
            <button onClick={resetGame} className="nav-btn">
              <i className="fas fa-sync"></i>
            </button>
          </div>
        </div>
      </header>

      <div className="game-container">
        <div className="cards-container">
          <div 
            className="cards-grid"
            style={{
              gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`
            }}
          >
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-front">
                  <span>{index + 1}</span>
                </div>
                <div className="card-back">
                  {card.isImage ? (
                    <img src={card.value} alt="Card" className="card-image" />
                  ) : (
                    <div className="word-content">{card.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <>
          <div className="modal-overlay" onClick={toggleThemeModal}></div>
          <div className="modal" id="themeModal">
            <div className="modal-content">
              <h2 className="modal-title">Select Theme</h2>
              <div className="theme-grid">
                {THEMES.map((theme, index) => (
                  <div 
                    key={index}
                    className={`theme-option ${selectedTheme.name === theme.name ? 'selected' : ''}`}
                    onClick={() => selectTheme(theme)}
                  >
                    <img src={theme.path} alt={theme.name} />
                    <div className="theme-name">{theme.name}</div>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button onClick={toggleThemeModal} className="btn btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Win Modal */}
      {gameWon && (
        <>
          <div className="modal-overlay"></div>
          <div className="modal" id="winModal">
            <div className="modal-content">
              <h2 className="modal-title">Congratulations! 🎉</h2>
              <div className="win-stats">
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span>Matches: <span>{matches}</span></span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-redo"></i>
                  <span>Attempts: <span>{attempts}</span></span>
                </div>
              </div>
              <button onClick={resetGame} className="btn btn-primary">Play Again</button>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div className="modal-overlay" onClick={toggleSettingsModal}></div>
          <div className="modal" id="settingsModal">
            <div className="modal-content">
              <h2 className="modal-title">Game Settings</h2>
              
              <div className="settings-section">
                <h3>Language</h3>
                <div className="settings-options">
                  {LANGUAGES.map((lang: { code: string; name: string }, index: number) => (
                    <button 
                      key={index} 
                      className={`settings-option ${currentLanguage === lang.code ? 'selected' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Topic</h3>
                <div className="settings-options">
                  {TOPICS.map((t: { code: string; name: string }, index: number) => (
                    <button 
                      key={index} 
                      className={`settings-option ${currentTopic === t.code ? 'selected' : ''}`}
                      onClick={() => handleTopicChange(t.code)}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Difficulty</h3>
                <div className="settings-grid">
                  {DIFFICULTIES.map((diff: { code: string; name: string; pairs: number; grid: string }, index: number) => (
                    <button 
                      key={index} 
                      className={`difficulty-option ${currentDifficulty === diff.code ? 'selected' : ''}`}
                      onClick={() => handleDifficultyChange(diff.code)}
                    >
                      <div className="difficulty-option-info">
                        <div>{diff.name}</div>
                        <div className="difficulty-option-detail">{diff.pairs} pairs ({diff.grid})</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="modal-buttons">
                <button onClick={toggleSettingsModal} className="btn btn-secondary">Cancel</button>
                <button onClick={resetGame} className="btn btn-primary">Apply</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Audio Elements */}
      <audio id="correctSound" src="/games/memory-game/sounds/correct.mp3"></audio>
      <audio id="wrongSound" src="/games/memory-game/sounds/wrong.mp3"></audio>
      <audio id="winSound" src="/games/memory-game/sounds/win.mp3"></audio>

      {/* Add Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      {/* CustomWordsModal */}
      <CustomWordsModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsSubmit}
      />

      <style jsx>{`
        /* Original game CSS */
        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.5s;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          margin: 5px;
          perspective: 1000px;
        }
        
        .card.flipped {
          transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 10px;
        }
        
        .card-front {
          background: linear-gradient(135deg, #4a90e2, #7e57c2);
          color: white;
          font-size: 2.5rem;
          font-weight: bold;
        }
        
        .card-back {
          background: white;
          color: #333;
          transform: rotateY(180deg);
          font-size: 1.2rem;
          text-align: center;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card.matched {
          animation: matchPulse 1s;
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
        }

        .card.matched .card-back {
          background-color: #4caf50;
          color: white;
        }
        
        @keyframes matchPulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        
        .word-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-transform: capitalize;
        }
        
        .settings-section {
          margin-bottom: 20px;
        }
        
        .settings-section h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        
        .settings-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }
        
        .settings-option, .difficulty-option {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .settings-option:hover, .difficulty-option:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .settings-option.selected, .difficulty-option.selected {
          background-color: #4a90e2;
          color: white;
        }
        
        .difficulty-option {
          display: flex;
          align-items: center;
          padding: 10px;
          text-align: left;
        }
        
        .difficulty-option-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .difficulty-option-detail {
          font-size: 0.8rem;
          opacity: 0.7;
        }
        
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        @media (min-width: 768px) {
          .settings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
} 