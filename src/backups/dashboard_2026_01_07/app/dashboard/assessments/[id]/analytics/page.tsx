'use client';

import { useRouter, useParams } from 'next/navigation';
import { AssessmentAnalyticsDashboard } from '@/components/dashboard/AssessmentAnalyticsDashboard';

export default function AssessmentAnalyticsPage() {
    const router = useRouter();
    const params = useParams();
    const assignmentId = params.id as string;

    const handleBack = () => {
        router.push('/dashboard/assessments');
    };

    return (
        <AssessmentAnalyticsDashboard
            assignmentId={assignmentId}
            onBack={handleBack}
        />
    );
}
