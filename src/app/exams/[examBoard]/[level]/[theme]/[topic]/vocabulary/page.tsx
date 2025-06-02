'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

// Topic names map
const topicNames: Record<string, string> = {
  '1': 'Identity and relationships with others',
  '2': 'Healthy living and lifestyle',
  '3': 'Education and work',
  '4': 'Free-time activities',
  '5': 'Customs, festivals and celebrations',
  '6': 'Celebrity culture',
  '7': 'Travel and tourism, including places of interest',
  '8': 'Media and technology',
  '9': 'The environment and where people live'
};

// Vocabulary data by topic ID (mock data)
const vocabularyByTopic: Record<string, any[]> = {
  '1': [
    { id: '1', term: 'la familia', translation: 'family', contextSentence: 'Mi familia es muy importante para mí.', difficulty: 'Foundation' },
    { id: '2', term: 'los padres', translation: 'parents', contextSentence: 'Mis padres son muy estrictos.', difficulty: 'Foundation' },
    { id: '3', term: 'el hermano / la hermana', translation: 'brother / sister', contextSentence: 'Tengo un hermano y dos hermanas.', difficulty: 'Foundation' },
    { id: '4', term: 'el abuelo / la abuela', translation: 'grandfather / grandmother', contextSentence: 'Mis abuelos viven en el campo.', difficulty: 'Foundation' },
    { id: '5', term: 'el primo / la prima', translation: 'cousin', contextSentence: 'Mis primos vienen a visitarnos cada verano.', difficulty: 'Foundation' },
    { id: '6', term: 'el amigo / la amiga', translation: 'friend', contextSentence: 'Mi mejor amiga se llama Ana.', difficulty: 'Foundation' },
    { id: '7', term: 'el novio / la novia', translation: 'boyfriend / girlfriend', contextSentence: 'Mi novio y yo vamos al cine los fines de semana.', difficulty: 'Foundation' },
    { id: '8', term: 'llevarse bien con', translation: 'to get along with', contextSentence: 'Me llevo bien con mi hermana mayor.', difficulty: 'Higher' },
    { id: '9', term: 'discutir con', translation: 'to argue with', contextSentence: 'A veces discuto con mis padres sobre la hora de regresar a casa.', difficulty: 'Higher' },
    { id: '10', term: 'la relación', translation: 'relationship', contextSentence: 'Tengo una buena relación con mis padres.', difficulty: 'Higher' },
    { id: '11', term: 'comprensivo/a', translation: 'understanding', contextSentence: 'Mi madre es muy comprensiva cuando tengo problemas.', difficulty: 'Higher' },
    { id: '12', term: 'cariñoso/a', translation: 'affectionate', contextSentence: 'Mi abuelo es muy cariñoso con todos sus nietos.', difficulty: 'Higher' },
  ],
  '2': [
    { id: '13', term: 'sano/a', translation: 'healthy', contextSentence: 'Llevo una vida sana.', difficulty: 'Foundation' },
    { id: '14', term: 'la dieta', translation: 'diet', contextSentence: 'Una dieta equilibrada es importante.', difficulty: 'Foundation' },
    { id: '15', term: 'hacer ejercicio', translation: 'to exercise', contextSentence: 'Hago ejercicio tres veces por semana.', difficulty: 'Foundation' },
    { id: '16', term: 'el deporte', translation: 'sport', contextSentence: 'Me encanta practicar deportes.', difficulty: 'Foundation' },
    { id: '17', term: 'dormir', translation: 'to sleep', contextSentence: 'Duermo ocho horas cada noche.', difficulty: 'Foundation' },
    { id: '18', term: 'descansar', translation: 'to rest', contextSentence: 'Es importante descansar después de hacer ejercicio.', difficulty: 'Higher' },
    { id: '19', term: 'el estrés', translation: 'stress', contextSentence: 'Los exámenes me causan mucho estrés.', difficulty: 'Higher' },
    { id: '20', term: 'la rutina diaria', translation: 'daily routine', contextSentence: 'Mi rutina diaria incluye comer bien y hacer ejercicio.', difficulty: 'Higher' },
  ],
  '3': [
    { id: '21', term: 'el colegio / el instituto', translation: 'school', contextSentence: 'Mi colegio está cerca de mi casa.', difficulty: 'Foundation' },
    { id: '22', term: 'la asignatura', translation: 'subject', contextSentence: 'Mi asignatura favorita es la historia.', difficulty: 'Foundation' },
    { id: '23', term: 'el profesor / la profesora', translation: 'teacher', contextSentence: 'Mi profesora de español es muy simpática.', difficulty: 'Foundation' },
    { id: '24', term: 'estudiar', translation: 'to study', contextSentence: 'Estudio mucho para mis exámenes.', difficulty: 'Foundation' },
    { id: '25', term: 'aprobar', translation: 'to pass', contextSentence: 'Necesito aprobar todas mis asignaturas.', difficulty: 'Foundation' },
    { id: '26', term: 'suspender', translation: 'to fail', contextSentence: 'No quiero suspender ningún examen.', difficulty: 'Foundation' },
    { id: '27', term: 'el trabajo', translation: 'job/work', contextSentence: 'Mi padre tiene un buen trabajo.', difficulty: 'Foundation' },
    { id: '28', term: 'la carrera', translation: 'career', contextSentence: 'Quiero estudiar una carrera en medicina.', difficulty: 'Higher' },
    { id: '29', term: 'la universidad', translation: 'university', contextSentence: 'Me gustaría ir a la universidad para estudiar ingeniería.', difficulty: 'Higher' },
    { id: '30', term: 'el futuro', translation: 'future', contextSentence: 'En el futuro, quiero ser médico.', difficulty: 'Higher' },
  ],
  '4': [
    { id: '31', term: 'el tiempo libre', translation: 'free time', contextSentence: 'En mi tiempo libre, me gusta leer.', difficulty: 'Foundation' },
    { id: '32', term: 'el pasatiempo', translation: 'hobby', contextSentence: 'Mi pasatiempo favorito es tocar la guitarra.', difficulty: 'Foundation' },
    { id: '33', term: 'jugar a', translation: 'to play (a game/sport)', contextSentence: 'Me gusta jugar al fútbol.', difficulty: 'Foundation' },
  ],
  // Add mock data for other topics as needed
};

export default function VocabularyPage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string; level: string; theme: string; topic: string }>();
  const { examBoard = '', level = '', theme = '', topic = '' } = params || {};
  const searchParams = useSearchParams();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  
  // Get the topic name
  const topicName = topicNames[topic] || 'Unknown Topic';
  
  // Get vocabulary for the topic
  const vocabulary = vocabularyByTopic[topic] || [];
  
  // Filter vocabulary based on difficulty and search term
  const filteredVocabulary = vocabulary.filter(item => 
    (filterDifficulty === 'All' || item.difficulty === filterDifficulty) &&
    (searchTerm === '' || 
     item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.translation.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const toggleTranslation = (id: string) => {
    setShowTranslation(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleAllTranslations = () => {
    // If any translations are hidden, show all; otherwise hide all
    const areAnyHidden = filteredVocabulary.some(item => !showTranslation[item.id]);
    
    const newShowTranslation: Record<string, boolean> = {};
    filteredVocabulary.forEach(item => {
      newShowTranslation[item.id] = areAnyHidden;
    });
    
    setShowTranslation(newShowTranslation);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/exams/${examBoard}/${level}/${theme}/${topic}`)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Topic
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        Vocabulary: {topicName}
      </h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter by difficulty:</label>
          <select
            className="border rounded p-2"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Foundation">Foundation</option>
            <option value="Higher">Higher</option>
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border rounded-md"
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={toggleAllTranslations}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          {filteredVocabulary.some(item => !showTranslation[item.id]) ? 'Show All Translations' : 'Hide All Translations'}
        </button>
      </div>
      
      {filteredVocabulary.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No vocabulary items found for your search criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVocabulary.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 border rounded-lg transition-all ${
                item.difficulty === 'Foundation' ? 'border-green-200' : 'border-blue-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{item.term}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.difficulty === 'Foundation' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                  
                  {showTranslation[item.id] && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Translation:</span> {item.translation}
                    </p>
                  )}
                  
                  <p className="mt-2 text-gray-700 italic">"{item.contextSentence}"</p>
                </div>
                
                <div className="mt-3 md:mt-0">
                  <button
                    onClick={() => toggleTranslation(item.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    {showTranslation[item.id] ? 'Hide Translation' : 'Show Translation'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Practice these vocabulary items to improve your language skills.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push(`/exams/${examBoard}/${level}/${theme}/${topic}/reading?difficulty=foundation`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Practice Reading
          </button>
          <button
            onClick={() => router.push(`/games/word-blast`)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Practice with Games
          </button>
        </div>
      </div>
    </div>
  );
} 