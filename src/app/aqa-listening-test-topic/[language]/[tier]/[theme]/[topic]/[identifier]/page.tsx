'use client';

import React from 'react';
import AQATopicListeningAssessment from '../../../../../../../components/assessments/AQATopicListeningAssessment';
import { Volume2, ArrowLeft, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AQATopicListeningAssessmentPage() {
    const params = useParams();
    const language = params.language as string;
    const tier = params.tier as string;
    const theme = decodeURIComponent(params.theme as string);
    const topic = decodeURIComponent(params.topic as string);
    const identifier = params.identifier as string;

    // Validate parameters
    if (!language || !['es', 'fr', 'de'].includes(language)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Language</h1>
                    <p className="text-gray-600 mb-4">Please select a valid language (Spanish, French, or German).</p>
                    <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
                        Back to Topic Assessment Selection
                    </Link>
                </div>
            </div>
        );
    }

    if (!tier || !['foundation', 'higher'].includes(tier)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Assessment Tier</h1>
                    <p className="text-gray-600 mb-4">Please select either Foundation or Higher tier.</p>
                    <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
                        Back to Topic Assessment Selection
                    </Link>
                </div>
            </div>
        );
    }

    if (!theme || !topic || !identifier) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Assessment Parameters</h1>
                    <p className="text-gray-600 mb-4">Missing theme, topic, or assessment identifier.</p>
                    <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
                        Back to Topic Assessment Selection
                    </Link>
                </div>
            </div>
        );
    }

    // Language mapping
    const languageMap: Record<string, { name: string; flag: string }> = {
        'es': { name: 'Spanish', flag: '🇪🇸' },
        'fr': { name: 'French', flag: '🇫🇷' },
        'de': { name: 'German', flag: '🇩🇪' }
    };

    const languageInfo = languageMap[language];
    const difficulty = tier as 'foundation' | 'higher';
    const timeLimit = difficulty === 'foundation' ? 20 : 25; // Topic assessments are shorter
    const assessmentNumber = identifier.split('-').pop(); // Get last part as number

    // Get theme display name (remove "Theme X: " prefix)
    const themeDisplayName = theme.includes(': ') ? theme.split(': ')[1] : theme;

    // We need to fetch assessment details to know the board/level for the title
    // Ideally this would be passed or fetched, but for now we can infer or use a generic title if needed.
    // However, since we are in a server component (or client component acting as page), we might not have the full assessment object yet.
    // Let's use a state to hold it if we want to be precise, or just use "Topic Listening" which is safe.
    // But the user specifically asked for "Edexcel..." etc.
    // Let's fetch it.
    const [assessment, setAssessment] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchAssessment = async () => {
            try {
                // We can use the service or just a direct fetch if we had an endpoint by identifier
                // But we can also just rely on the component to show the right title inside itself.
                // However, this is the PAGE title.
                // Let's try to fetch it.
                const response = await fetch(`/api/topic-assessments?language=${language}&level=${difficulty}&theme=${encodeURIComponent(theme)}&topic=${encodeURIComponent(topic)}`);
                const data = await response.json();
                if (data.assessments) {
                    const found = data.assessments.find((a: any) => a.identifier === identifier);
                    if (found) setAssessment(found);
                }
            } catch (e) {
                console.error("Failed to fetch assessment details for title", e);
            }
        };
        fetchAssessment();
    }, [language, difficulty, theme, topic, identifier]);

    const handleComplete = (results: any) => {
        console.log(`AQA Topic Listening Assessment (${languageInfo.name} ${tier} - ${topic}) completed:`, results);
        // alert(`Topic assessment completed! You answered ${results.questionsCompleted} questions in ${Math.floor(results.totalTimeSpent / 60)} minutes and ${results.totalTimeSpent % 60} seconds.`);
    };

    const handleQuestionComplete = (questionId: string, answer: any, timeSpent: number) => {
        console.log(`Question ${questionId} completed:`, answer, `Time: ${timeSpent}s`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/exam-style-assessment-topic"
                                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Topic Assessment Selection
                            </Link>
                            <div className="flex items-center">
                                <span className="text-3xl mr-3">{languageInfo.flag}</span>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {assessment?.exam_board === 'Edexcel' ? 'Edexcel' : assessment?.curriculum_level === 'ks3' ? 'KS3' : 'AQA'} Topic Listening - {difficulty === 'foundation' ? 'Foundation' : 'Higher'} #{assessmentNumber}
                                    </h1>
                                    <p className="text-gray-600">{languageInfo.name} • {difficulty === 'foundation' ? 'Foundation' : 'Higher'} • {timeLimit} minutes</p>
                                    <div className="flex items-center mt-1">
                                        <Target className="h-4 w-4 mr-1 text-purple-600" />
                                        <span className="text-sm text-purple-700 font-medium">{themeDisplayName}: {topic}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="h-5 w-5 mr-2" />
                            <span className="font-medium">{timeLimit} minutes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Content */}
            <div className="py-8">
                <AQATopicListeningAssessment
                    language={language as 'es' | 'fr' | 'de'}
                    level="KS4"
                    difficulty={difficulty}
                    theme={theme}
                    topic={topic}
                    identifier={identifier}
                    onComplete={handleComplete}
                    onQuestionComplete={handleQuestionComplete}
                />
            </div>

            {/* Footer Info */}
            <div className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Topic Assessment</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Based on AQA GCSE {languageInfo.name} listening assessment format ({difficulty === 'foundation' ? 'Foundation' : 'Higher'})</p>
                                <p>• Focused on: <span className="font-medium text-purple-700">{topic}</span></p>
                                <p>• Theme: <span className="font-medium">{themeDisplayName}</span></p>
                                <p>• Assessment #{assessmentNumber} with topic-specific content</p>
                                <p>• {timeLimit}-minute time limit</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types Included</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>1. Multiple choice (Listening comprehension)</p>
                                <p>2. Open response (Listening comprehension)</p>
                                <p>3. Gap fill</p>
                                <p className="mt-3 text-xs text-gray-500">
                                    * Topic assessments contain 10 questions focused specifically on {topic.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-8 p-4 ${difficulty === 'foundation' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'} border rounded-lg`}>
                        <h4 className={`font-semibold ${difficulty === 'foundation' ? 'text-blue-900' : 'text-purple-900'} mb-2`}>
                            {difficulty === 'foundation' ? 'Foundation Tier' : 'Higher Tier'} Topic Focus
                        </h4>
                        <p className={`text-sm ${difficulty === 'foundation' ? 'text-blue-800' : 'text-purple-800'}`}>
                            {difficulty === 'foundation'
                                ? `This topic assessment focuses specifically on "${topic}" within the ${themeDisplayName} theme. Content is designed to build confidence with targeted practice on this specific area.`
                                : `This Higher tier topic assessment includes more complex audio tracks and vocabulary related to "${topic}". Questions require deeper analysis and understanding of nuanced meanings within this specific topic area.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
