'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AssessmentPreviewPage() {
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string>('2f84506c-c0c6-4642-bcbb-c2d37e4aa30b');

    const supabase = createClient();

    useEffect(() => {
        generatePreview();
    }, []);

    const generatePreview = async () => {
        setLoading(true);
        setError(null);
        try {
            let task, questions;

            // Try fetching from Supabase
            const { data: taskData, error: taskError } = await supabase
                .from('reading_comprehension_tasks')
                .select('*')
                .eq('id', taskId)
                .maybeSingle();

            if (taskError) {
                console.warn('Supabase fetch error (likely RLS), using fallback data:', taskError);
            }

            if (taskData) {
                task = taskData;
                const { data: questionsData } = await supabase
                    .from('reading_comprehension_questions')
                    .select('*')
                    .eq('task_id', taskId);
                questions = questionsData || [];
            } else {
                // Fallback data if DB access fails or no data found
                console.log('Using fallback data for preview');
                task = {
                    id: '2f84506c-c0c6-4642-bcbb-c2d37e4aa30b',
                    title: 'Spanish Family Traditions',
                    language: 'spanish',
                    difficulty: 'foundation',
                    content: "En mi familia tenemos muchas tradiciones especiales. Cada domingo, toda la familia se reúne en casa de mis abuelos para almorzar juntos. Mi abuela cocina paella, que es mi plato favorito. Después de comer, los adultos hablan mientras los niños jugamos en el jardín.\n\nDurante las vacaciones de verano, siempre vamos a la playa por dos semanas. Alquilamos una casa cerca del mar y pasamos los días nadando y tomando el sol. Por las noches, paseamos por el pueblo y compramos helados.\n\nEn Navidad, decoramos el árbol todos juntos el día 8 de diciembre. Cada persona pone una decoración especial. El día de Nochebuena, cenamos en familia y después abrimos los regalos. Es mi época favorita del año porque toda la familia está junta y feliz."
                };
                questions = [
                    {
                        id: '055a1dde-00e3-4dd1-a0f5-c52d28b89bb3',
                        question_number: 1,
                        question: 'When does the family meet?',
                        type: 'multiple-choice',
                        options: ['Los sábados', 'Los domingos', 'Los viernes', 'Todos los días'],
                        correct_answer: ['sundays', 'sunday'],
                        points: 2,
                        explanation: 'The text says "Cada domingo, toda la familia se reúne"'
                    },
                    {
                        id: '092f9a28-f9b2-417a-9caa-8b50fcd473cf',
                        question_number: 2,
                        question: 'What does the grandmother cook?',
                        type: 'short-answer',
                        options: null,
                        correct_answer: 'paella',
                        points: 1,
                        explanation: 'The text mentions "Mi abuela cocina paella"'
                    },
                    {
                        id: '6620032f-e545-4fdc-a85e-523287b3042e',
                        question_number: 3,
                        question: 'When do they decorate the Christmas tree?',
                        type: 'short-answer',
                        options: null,
                        correct_answer: 'on December 8th',
                        points: 2,
                        explanation: 'The text says "decoramos el árbol todos juntos el día 8 de diciembre"'
                    }
                ];
            }

            // Construct Worksheet Object
            const worksheet = {
                id: task.id,
                title: task.title,
                subject: task.language || 'Spanish',
                topic: 'Reading Comprehension',
                difficulty: task.difficulty,
                template_id: 'assessment_worksheet',
                content: {
                    task: task,
                    questions: questions
                }
            };

            // Call Generation API
            const response = await fetch('/api/worksheets/generate-html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ worksheet }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate HTML');
            }

            const data = await response.json();
            setHtml(data.html);

        } catch (err: any) {
            console.error('Error generating preview:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Assessment Worksheet Preview</h1>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            className="border p-2 rounded w-96"
                            placeholder="Task ID"
                        />
                        <button
                            onClick={generatePreview}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="bg-white p-12 rounded-lg shadow text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Generating worksheet...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {html && !loading && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <iframe
                            srcDoc={html}
                            className="w-full h-[1200px] border-none"
                            title="Worksheet Preview"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
