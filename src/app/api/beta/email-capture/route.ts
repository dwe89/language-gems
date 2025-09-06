import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, feature, priority = 'medium', source = 'coming-soon' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('beta_email_signups')
      .select('id, features')
      .eq('email', email)
      .single();

    if (existingEmail) {
      // Update existing record with new feature interest
      const currentFeatures = existingEmail.features || [];
      const updatedFeatures = feature && !currentFeatures.includes(feature) 
        ? [...currentFeatures, feature]
        : currentFeatures;

      const { error: updateError } = await supabase
        .from('beta_email_signups')
        .update({
          features: updatedFeatures,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingEmail.id);

      if (updateError) {
        console.error('Error updating email signup:', updateError);
        return NextResponse.json(
          { error: 'Failed to update signup' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Email updated with new feature interest',
        isExisting: true,
      });
    }

    // Create new email signup record
    const { error: insertError } = await supabase
      .from('beta_email_signups')
      .insert({
        email,
        features: feature ? [feature] : [],
        priority,
        source,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting email signup:', insertError);
      return NextResponse.json(
        { error: 'Failed to save email signup' },
        { status: 500 }
      );
    }

    // Optional: Send welcome email or add to mailing list
    // This could integrate with your email service (Mailchimp, ConvertKit, etc.)
    
    return NextResponse.json({
      success: true,
      message: 'Email successfully added to beta list',
      isExisting: false,
    });

  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get email signup stats (for admin dashboard)
    const { data: stats, error } = await supabase
      .from('beta_email_signups')
      .select('id, created_at, features, priority, source');

    if (error) {
      console.error('Error fetching email stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Process stats
    const totalSignups = stats?.length || 0;
    const recentSignups = stats?.filter(signup => {
      const signupDate = new Date(signup.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return signupDate > weekAgo;
    }).length || 0;

    const featureInterest = stats?.reduce((acc: Record<string, number>, signup) => {
      signup.features?.forEach((feature: string) => {
        acc[feature] = (acc[feature] || 0) + 1;
      });
      return acc;
    }, {}) || {};

    const sourceBreakdown = stats?.reduce((acc: Record<string, number>, signup) => {
      acc[signup.source] = (acc[signup.source] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      totalSignups,
      recentSignups,
      featureInterest,
      sourceBreakdown,
    });

  } catch (error) {
    console.error('Email stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
