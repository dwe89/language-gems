'use client';

import { useState } from 'react';

export default function WorksheetPreviewPage() {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSample = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/generate/worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Spanish',
          language: 'Spanish',
          level: 'GCSE',
          topic: 'Present Tense Regular Verbs',
          worksheetType: 'grammar',
          exerciseTypes: ['fill_in_blanks', 'translation', 'error_correction']
        })
      });

      const data = await response.json();
      if (data.html) {
        setHtml(data.html);
      }
    } catch (error) {
      console.error('Error generating worksheet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          🎨 PREMIUM Worksheet Preview
        </h1>
        
        <button
          onClick={generateSample}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
            color: '#0F172A',
            padding: '16px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}
        >
          {loading ? '⏳ Generating Amazing Worksheet...' : '✨ Generate Sample Worksheet'}
        </button>

        {html && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const blob = new Blob([html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'worksheet-preview.html';
                  a.click();
                }}
                style={{
                  background: '#1E40AF',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                📥 Download HTML
              </button>
              
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                  }
                }}
                style={{
                  background: '#10B981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🖨️ Open in New Tab
              </button>
            </div>
            
            <iframe
              srcDoc={html}
              style={{
                width: '100%',
                height: '1400px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px'
              }}
              title="Worksheet Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}

