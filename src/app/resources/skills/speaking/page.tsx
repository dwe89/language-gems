import React from 'react';
import FreebiesBreadcrumb from '../../../../components/freebies/FreebiesBreadcrumb';

export default function SpeakingSkillPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <FreebiesBreadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Skills Hub', href: '/resources/skills' },
              { label: 'Speaking', active: true }
            ]}
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Speaking Skill</h1>
          <p className="text-slate-600">Speaking resources coming soon.</p>
        </div>
      </div>
    </div>
  );
}
