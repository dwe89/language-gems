'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DailyLifePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('french');
  
  const languages = [
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'mandarin', name: 'Mandarin' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'italian', name: 'Italian' },
  ];

  // Sample vocabulary sets for different languages
  const vocabularySets = {
    french: [
      { term: 'le matin', translation: 'morning', example: 'Je me lève le matin à 7h.' },
      { term: 'le petit-déjeuner', translation: 'breakfast', example: 'Je prends mon petit-déjeuner à 8h.' },
      { term: 'se brosser les dents', translation: 'to brush teeth', example: 'Je me brosse les dents après chaque repas.' },
      { term: 'aller au travail', translation: 'to go to work', example: 'Je vais au travail en bus.' },
      { term: 'le déjeuner', translation: 'lunch', example: 'Je prends le déjeuner avec mes collègues.' },
      { term: 'rentrer à la maison', translation: 'to return home', example: 'Je rentre à la maison vers 18h.' },
      { term: 'préparer le dîner', translation: 'to prepare dinner', example: 'Je prépare le dîner pour ma famille.' },
      { term: 'regarder la télé', translation: 'to watch TV', example: 'Nous regardons la télé ensemble le soir.' },
      { term: 'se coucher', translation: 'to go to bed', example: 'Je me couche à 23h.' },
    ],
    german: [
      { term: 'der Morgen', translation: 'morning', example: 'Ich stehe am Morgen um 7 Uhr auf.' },
      { term: 'das Frühstück', translation: 'breakfast', example: 'Ich frühstücke um 8 Uhr.' },
      { term: 'Zähne putzen', translation: 'to brush teeth', example: 'Ich putze mir nach jeder Mahlzeit die Zähne.' },
      { term: 'zur Arbeit gehen', translation: 'to go to work', example: 'Ich fahre mit dem Bus zur Arbeit.' },
      { term: 'das Mittagessen', translation: 'lunch', example: 'Ich esse mit meinen Kollegen zu Mittag.' },
      { term: 'nach Hause kommen', translation: 'to return home', example: 'Ich komme gegen 18 Uhr nach Hause.' },
      { term: 'das Abendessen vorbereiten', translation: 'to prepare dinner', example: 'Ich bereite das Abendessen für meine Familie vor.' },
      { term: 'fernsehen', translation: 'to watch TV', example: 'Wir sehen abends zusammen fern.' },
      { term: 'ins Bett gehen', translation: 'to go to bed', example: 'Ich gehe um 23 Uhr ins Bett.' },
    ],
    japanese: [
      { term: '朝 (asa)', translation: 'morning', example: '私は朝7時に起きます。(Watashi wa asa shichi-ji ni okimasu.)' },
      { term: '朝ごはん (asagohan)', translation: 'breakfast', example: '私は8時に朝ごはんを食べます。(Watashi wa hachi-ji ni asagohan o tabemasu.)' },
      { term: '歯を磨く (ha o migaku)', translation: 'to brush teeth', example: '食後に歯を磨きます。(Shokugo ni ha o migakimasu.)' },
      { term: '仕事へ行く (shigoto e iku)', translation: 'to go to work', example: '私はバスで仕事へ行きます。(Watashi wa basu de shigoto e ikimasu.)' },
      { term: '昼ごはん (hirugohan)', translation: 'lunch', example: '同僚と昼ごはんを食べます。(Dōryō to hirugohan o tabemasu.)' },
      { term: '家に帰る (ie ni kaeru)', translation: 'to return home', example: '18時ごろ家に帰ります。(Jūhachi-ji goro ie ni kaerimasu.)' },
      { term: '夕食を作る (yūshoku o tsukuru)', translation: 'to prepare dinner', example: '家族のために夕食を作ります。(Kazoku no tame ni yūshoku o tsukurimasu.)' },
      { term: 'テレビを見る (terebi o miru)', translation: 'to watch TV', example: '夜は一緒にテレビを見ます。(Yoru wa issho ni terebi o mimasu.)' },
      { term: '寝る (neru)', translation: 'to go to bed', example: '23時に寝ます。(Nijūsan-ji ni nemasu.)' },
    ],
  };

  // Default to French if the selected language doesn't have data
  const currentVocabulary = vocabularySets[selectedLanguage] || vocabularySets.french;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Daily Life Vocabulary</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Essential words and phrases for everyday situations in different languages.
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <h2 className="text-lg font-medium text-center mb-3 text-white">Select Language</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => setSelectedLanguage(language.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedLanguage === language.id 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Content */}
      <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-300">Common Daily Activities</h2>
          <Link href={`/learn/${selectedLanguage}`} className="text-sm text-cyan-300 hover:underline">
            Back to {languages.find(l => l.id === selectedLanguage)?.name || 'Language'} Learning
          </Link>
        </div>

        {/* Vocabulary Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-700/50 text-left">
                <th className="py-3 px-4 font-semibold text-white">{languages.find(l => l.id === selectedLanguage)?.name || 'Term'}</th>
                <th className="py-3 px-4 font-semibold text-white">English</th>
                <th className="py-3 px-4 font-semibold text-white hidden md:table-cell">Example</th>
              </tr>
            </thead>
            <tbody>
              {currentVocabulary.map((item, index) => (
                <tr key={index} className="border-b border-indigo-700/30 hover:bg-indigo-800/20">
                  <td className="py-3 px-4 font-medium">{item.term}</td>
                  <td className="py-3 px-4">{item.translation}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-white/70 italic">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Related Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-cyan-300">Related Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              href="/learn/food" 
              className="bg-indigo-800/40 p-5 rounded-lg hover:bg-indigo-700/40 transition-colors block"
            >
              <h3 className="text-xl font-bold mb-2">Food & Dining</h3>
              <p className="text-white/70">Vocabulary for cooking, eating, and dining out</p>
            </Link>
            <Link 
              href="/learn/travel" 
              className="bg-indigo-800/40 p-5 rounded-lg hover:bg-indigo-700/40 transition-colors block"
            >
              <h3 className="text-xl font-bold mb-2">Travel</h3>
              <p className="text-white/70">Essential words for getting around</p>
            </Link>
            <Link 
              href="/learn/health" 
              className="bg-indigo-800/40 p-5 rounded-lg hover:bg-indigo-700/40 transition-colors block"
            >
              <h3 className="text-xl font-bold mb-2">Health & Wellness</h3>
              <p className="text-white/70">Terms related to body, health, and medical situations</p>
            </Link>
          </div>
        </div>

        {/* Practice Section */}
        <div className="mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Practice These Words</h2>
            <p className="mb-6 text-white/80">Reinforce your learning with our interactive exercises.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/exercises/vocabulary" 
                className="gem-button"
              >
                Flashcards
              </Link>
              <Link 
                href="/games/memory-game" 
                className="purple-gem-button"
              >
                Memory Game
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 