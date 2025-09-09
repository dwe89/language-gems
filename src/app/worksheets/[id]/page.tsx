'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, Edit, Trash2, Eye, Clock, BookOpen, Target } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Worksheet {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic?: string;
  difficulty: string;
  template_id: string;
  content: any;
  html?: string;
  markdown?: string;
  estimated_time_minutes: number;
  question_count: number;
  tags: string[];
  created_at: string;
  user_id: string;
  is_public: boolean;
}

export default function WorksheetPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [generatingHtml, setGeneratingHtml] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadWorksheet();
  }, [params.id]);

  const generateHtmlForPreview = async (worksheet: Worksheet) => {
    console.log('🔍 [HTML GENERATION] generateHtmlForPreview called');
    console.log('📋 [HTML GENERATION] Full worksheet object:', JSON.stringify(worksheet, null, 2));

    // Check template_id first
    const templateId = worksheet.template_id;
    console.log('🏷️ [HTML GENERATION] Template ID from worksheet:', templateId);

    // Check metadata (can be in worksheet.metadata or worksheet.content.metadata)
    const metadata = (worksheet as any).metadata || worksheet.content?.metadata;
    console.log('📊 [HTML GENERATION] Metadata object:', JSON.stringify(metadata, null, 2));
    const metadataTemplate = metadata?.template;
    console.log('🏷️ [HTML GENERATION] Template from metadata:', metadataTemplate);

    // Check rawContent (can be in worksheet.rawContent or worksheet.content.rawContent)
    const rawContent = (worksheet as any).rawContent || worksheet.content?.rawContent;
    console.log('📦 [HTML GENERATION] Raw content exists?', !!rawContent);
    if (rawContent) {
      console.log('📦 [HTML GENERATION] Raw content keys:', Object.keys(rawContent));
      console.log('📦 [HTML GENERATION] Raw content sample:', JSON.stringify(rawContent, null, 2).substring(0, 500) + '...');
    }

    // Check content
    const content = worksheet.content;
    console.log('📄 [HTML GENERATION] Content exists?', !!content);
    if (content) {
      console.log('📄 [HTML GENERATION] Content keys:', Object.keys(content));
      console.log('📄 [HTML GENERATION] Content sample:', JSON.stringify(content, null, 2).substring(0, 500) + '...');
    }

    // Check if this is a reading comprehension template that needs HTML generation
    const isReadingComprehension = templateId === 'reading_comprehension' ||
                                   metadataTemplate === 'reading_comprehension' ||
                                   !!rawContent;

    // Check if this is a vocabulary practice template that needs HTML generation
    const isVocabularyPractice = templateId === 'vocabulary_practice' ||
                                metadataTemplate === 'vocabulary_practice';

    console.log('🤔 [HTML GENERATION] Template detection:');
    console.log('   - templateId:', templateId);
    console.log('   - metadataTemplate:', metadataTemplate);
    console.log('   - templateId === "reading_comprehension":', templateId === 'reading_comprehension');
    console.log('   - metadataTemplate === "reading_comprehension":', metadataTemplate === 'reading_comprehension');
    console.log('   - templateId === "vocabulary_practice":', templateId === 'vocabulary_practice');
    console.log('   - metadataTemplate === "vocabulary_practice":', metadataTemplate === 'vocabulary_practice');
    console.log('   - !!rawContent:', !!rawContent);
    console.log('   - FINAL RESULT:', isReadingComprehension);
    console.log('   - Final isVocabularyPractice:', isVocabularyPractice);

    if (isReadingComprehension || isVocabularyPractice) {
      console.log('🚀 [HTML GENERATION] Special template detected - generating fresh HTML from rawContent');
      console.log('   - Template type:', isReadingComprehension ? 'reading_comprehension' : 'vocabulary_practice');
      try {
        setGeneratingHtml(true);
        console.log('🚀 [HTML GENERATION] Calling /api/worksheets/generate-html...');

        const requestBody = { worksheet };
        console.log('📡 [HTML GENERATION] Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('/api/worksheets/generate-html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        console.log('📡 [HTML GENERATION] Response status:', response.status);
        console.log('📡 [HTML GENERATION] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [HTML GENERATION] API call failed:', response.status, errorText);
          throw new Error(`Failed to generate HTML: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ [HTML GENERATION] API call successful');
        console.log('📋 [HTML GENERATION] Result keys:', Object.keys(result));
        console.log('📋 [HTML GENERATION] HTML length:', result.html?.length || 0);
        console.log('📋 [HTML GENERATION] HTML preview (first 500 chars):', result.html?.substring(0, 500) + '...');

        setHtmlContent(result.html);
      } catch (err) {
        console.error('💥 [HTML GENERATION] Error generating HTML for preview:', err);
        setHtmlContent(null);
      } finally {
        setGeneratingHtml(false);
      }
    } else {
      console.log('📝 [HTML GENERATION] Not a special template - using existing worksheet.html');
      console.log('   - Available special templates: reading_comprehension, vocabulary_practice');
      const existingHtml = worksheet.html;
      console.log('📄 [HTML GENERATION] Existing HTML exists?', !!existingHtml);
      console.log('📄 [HTML GENERATION] Existing HTML length:', existingHtml?.length || 0);
      if (existingHtml) {
        console.log('📄 [HTML GENERATION] Existing HTML preview (first 500 chars):', existingHtml.substring(0, 500) + '...');
        setHtmlContent(existingHtml);
      } else {
        console.log('❌ [HTML GENERATION] No HTML available for non-reading comprehension worksheet');
        setHtmlContent(null);
      }
    }
  };

  const loadWorksheet = async () => {
    try {
      setLoading(true);
      console.log('🔍 [WORKSHEET PAGE] Starting to load worksheet with ID:', params.id);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 [WORKSHEET PAGE] Current user:', user?.id);

      // Fetch worksheet
      console.log('📡 [WORKSHEET PAGE] Fetching worksheet from database...');
      const { data, error } = await supabase
        .from('worksheets')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('❌ [WORKSHEET PAGE] Database error:', error);
        if (error.code === 'PGRST116') {
          // No rows returned - worksheet not found
          throw new Error('Worksheet not found');
        }
        throw new Error(error.message);
      }

      if (!data) {
        console.error('❌ [WORKSHEET PAGE] No worksheet data returned');
        throw new Error('Worksheet not found');
      }

      console.log('✅ [WORKSHEET PAGE] Worksheet loaded from database:', {
        id: data.id,
        title: data.title,
        template_id: data.template_id,
        subject: data.subject,
        hasContent: !!data.content,
        hasHtml: !!data.html,
        hasRawContent: !!(data as any).rawContent,
        metadata: (data as any).metadata,
        contentKeys: data.content ? Object.keys(data.content) : [],
        allKeys: Object.keys(data)
      });

      // Transform the worksheet structure for special templates
      let transformedWorksheet = data;
      if (data.template_id === 'vocabulary_practice' || data.template_id === 'reading_comprehension') {
        console.log('🔄 [WORKSHEET PAGE] Transforming worksheet structure for special template');

        // Extract rawContent and metadata from content field to top level
        if (data.content?.rawContent) {
          transformedWorksheet = {
            ...data,
            rawContent: data.content.rawContent,
            metadata: data.content.metadata || data.metadata
          };
          console.log('✅ [WORKSHEET PAGE] Extracted rawContent to top level');
        }
      }

      setWorksheet(transformedWorksheet);
      setIsOwner(user?.id === data.user_id);

      // Generate HTML for preview using the transformed worksheet
      console.log('🚀 [WORKSHEET PAGE] About to generate HTML for preview...');
      await generateHtmlForPreview(transformedWorksheet);

    } catch (err) {
      console.error('💥 [WORKSHEET PAGE] Error loading worksheet:', err);
      setError(err instanceof Error ? err.message : 'Failed to load worksheet');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!worksheet) return;
    
    try {
      setDownloading(true);
      
      // Always generate fresh HTML to ensure we get the correct template
      console.log('🚀 [PDF DOWNLOAD] Generating fresh HTML for PDF...');
      console.log('📋 [PDF DOWNLOAD] Worksheet data:', {
        id: worksheet.id,
        title: worksheet.title,
        template_id: worksheet.template_id,
        subject: worksheet.subject,
        hasContent: !!worksheet.content,
        hasRawContent: !!(worksheet as any).rawContent,
        metadata: (worksheet as any).metadata
      });
      
      const htmlResponse = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worksheet })
      });
      
      if (!htmlResponse.ok) {
        const errorText = await htmlResponse.text();
        console.error('❌ [PDF DOWNLOAD] HTML generation failed:', htmlResponse.status, errorText);
        throw new Error(`Failed to generate HTML: ${htmlResponse.status} ${errorText}`);
      }
      
      const htmlResult = await htmlResponse.json();
      const htmlContent = htmlResult.html;
      console.log('✅ [PDF DOWNLOAD] Fresh HTML generated, length:', htmlContent.length);
      console.log('📄 [PDF DOWNLOAD] HTML preview (first 200 chars):', htmlContent.substring(0, 200));

      // Generate PDF
      const pdfResponse = await fetch('/api/worksheets/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          html: htmlContent,
          filename: `${worksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}`
        })
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${worksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track download
      await fetch('/api/worksheets/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          worksheetId: worksheet.id,
          fileName: a.download
        })
      });

    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const deleteWorksheet = async () => {
    if (!worksheet || !isOwner) return;
    
    if (!confirm('Are you sure you want to delete this worksheet? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('worksheets')
        .delete()
        .eq('id', worksheet.id);

      if (error) {
        throw new Error(error.message);
      }

      router.push('/worksheets');
    } catch (err) {
      console.error('Error deleting worksheet:', err);
      setError('Failed to delete worksheet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading worksheet...</p>
        </div>
      </div>
    );
  }

  if (error || !worksheet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Worksheet Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The worksheet you\'re looking for doesn\'t exist or you don\'t have permission to view it.'}</p>
          <button
            onClick={() => router.push('/worksheets')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Worksheets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{worksheet.title}</h1>
                <p className="text-sm text-slate-600">{worksheet.subject} • {worksheet.topic}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>

              {isOwner && (
                <>
                  <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={deleteWorksheet}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Worksheet Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-600">Difficulty:</span>
                    <span className="ml-2 capitalize font-medium">{worksheet.difficulty}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-600">Est. Time:</span>
                    <span className="ml-2 font-medium">{worksheet.estimated_time_minutes} min</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-600">Questions:</span>
                    <span className="ml-2 font-medium">{worksheet.question_count}</span>
                  </div>
                </div>
              </div>

              {worksheet.tags && worksheet.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {worksheet.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500">
                Created {new Date(worksheet.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Worksheet Preview</h2>
                  <div className="flex items-center text-sm text-slate-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview Mode
                  </div>
                </div>
              </div>

              <div className="p-6">
                {generatingHtml ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Generating Preview...</h3>
                    <p className="text-slate-600">Please wait while we prepare your worksheet preview.</p>
                  </div>
                ) : htmlContent ? (
                  <div
                    className="worksheet-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Preview Available</h3>
                    <p className="text-slate-600 mb-4">This worksheet doesn't have a preview. You can still download it as a PDF.</p>
                    <button
                      onClick={downloadPDF}
                      disabled={downloading}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      {downloading ? 'Generating PDF...' : 'Download PDF'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
