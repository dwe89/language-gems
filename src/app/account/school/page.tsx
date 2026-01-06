'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import {
  ArrowLeft, Users, Plus, Mail, Calendar, Crown,
  Trash2, UserCheck, AlertCircle, School, CheckCircle
} from 'lucide-react';

interface SchoolMember {
  id: string;
  role: 'owner' | 'member';
  status: string;
  joined_at: string;
  member_user_id: string;
  user_profiles: {
    email: string;
    display_name: string | null;
    subscription_status: string;
    created_at: string | null;
  };
}

interface PendingInvitation {
  id: string;
  teacher_email: string;
  teacher_name: string;
  invitation_sent_at: string;
  expires_at: string;
  status: string;
}

export default function SchoolManagementPage() {
  const { user, hasSubscription, isLoading, userRole } = useAuth();
  const [members, setMembers] = useState<SchoolMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [schoolCode, setSchoolCode] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSchoolOwner, setIsSchoolOwner] = useState<boolean>(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  // Check if user is a school owner
  useEffect(() => {
    const checkSchoolOwner = async () => {
      if (!user) {
        setCheckingPermissions(false);
        return;
      }

      try {
        const { data: profile } = await supabaseBrowser
          .from('user_profiles')
          .select('is_school_owner')
          .eq('user_id', user.id)
          .single();

        setIsSchoolOwner(profile?.is_school_owner || false);
      } catch (error) {
        console.error('Error checking school owner status:', error);
        setIsSchoolOwner(false);
      } finally {
        setCheckingPermissions(false);
      }
    };

    checkSchoolOwner();
  }, [user]);

  useEffect(() => {
    if (user && hasSubscription && isSchoolOwner) {
      fetchSchoolMembers();
    }
  }, [user, hasSubscription, isSchoolOwner]);

  const fetchSchoolMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school/members');
      const data = await response.json();

      if (data.success) {
        setMembers(data.members || []);
        setPendingInvitations(data.pending_invitations || []);
        setSchoolCode(data.school_code);
        setSchoolName(data.school_name || data.school_code);
      } else {
        setError(data.error || 'Failed to fetch school members');
      }
    } catch (error) {
      console.error('Error fetching school members:', error);
      setError('Failed to fetch school members');
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherEmail.trim()) return;

    try {
      setAddingTeacher(true);
      setError(null);
      setSuccess(null);

      // Use the new invitation endpoint that sends emails via Brevo
      const response = await fetch('/api/school/invite-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_email: newTeacherEmail.trim(),
          teacher_name: newTeacherName.trim() || newTeacherEmail.split('@')[0], // Use provided name or email prefix
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.invitation_sent) {
          setSuccess('Invitation email sent! The teacher will receive an email with signup instructions.');
        } else {
          setSuccess('Teacher added to school successfully and notified via email!');
        }
        setNewTeacherEmail('');
        setNewTeacherName('');
        await fetchSchoolMembers(); // Refresh the list
      } else {
        setError(data.error || 'Failed to add teacher');
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError('Failed to add teacher');
    } finally {
      setAddingTeacher(false);
    }
  };

  const removeTeacher = async (memberUserId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from your school?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/school/members?member_user_id=${memberUserId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Teacher removed from school successfully!');
        await fetchSchoolMembers(); // Refresh the list
      } else {
        setError(data.error || 'Failed to remove teacher');
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      setError('Failed to remove teacher');
    }
  };

  const deletePendingInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/school/invite-teacher?invitation_id=${invitationId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Invitation cancelled successfully!');
        await fetchSchoolMembers(); // Refresh the list
      } else {
        setError(data.error || 'Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      setError('Failed to cancel invitation');
    }
  };

  // Helper function to format dates in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading || checkingPermissions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading school management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in</h2>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Premium Required</h2>
          <p className="text-slate-600 mb-6">School management is available for Premium subscribers only.</p>
          <Link
            href="/account/upgrade"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  if (!isSchoolOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">School Owner Access Only</h2>
          <p className="text-slate-600 mb-6">
            Only school owners can manage teachers and invitations. You are currently a member of a school.
          </p>
          <Link
            href="/account"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
          >
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  // Individual Teachers shouldn't access this page
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  useEffect(() => {
    async function checkSubType() {
      if (user) {
        const { data } = await supabaseBrowser
          .from('user_profiles')
          .select('subscription_type')
          .eq('user_id', user.id)
          .single();
        if (data) setSubscriptionType(data.subscription_type);
      }
    }
    checkSubType();
  }, [user]);

  if (subscriptionType === 'individual_teacher') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Individual Teacher Plan</h2>
          <p className="text-slate-600 mb-6">
            Your plan is designed for a single teacher. You can manage your students and classes from the dashboard.
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/account"
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-block"
            >
              Back to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>

          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">School Management</h1>
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-white/90 text-lg mb-2">
                    You are the school owner for: <span className="font-bold">{schoolName || schoolCode}</span>
                  </p>
                  <p className="text-white/80 text-sm">
                    Add teachers to your school and they'll automatically get premium access
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Crown className="h-5 w-5 text-yellow-300" />
                    <span className="text-white font-semibold">School Owner</span>
                  </div>
                  <p className="text-white/80 text-xs">Full management access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How School Management Works</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>As the <strong>school owner</strong>, you created the first account for your school</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Add other teachers by entering their email address below</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Added teachers automatically get <strong>premium access</strong> as part of your school subscription</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Teachers must create an account with the email you provide to join your school</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Teacher Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-green-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-green-600" />
            Add Teacher to School
          </h2>

          <form onSubmit={addTeacher} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="teacherName" className="block text-sm font-medium text-slate-700 mb-2">
                  Teacher Name
                </label>
                <input
                  id="teacherName"
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="teacherEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="teacherEmail"
                  type="email"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="teacher@school.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={addingTeacher || !newTeacherEmail.trim()}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold"
            >
              {addingTeacher ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </>
              )}
            </button>
          </form>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="bg-amber-50 rounded-xl shadow-lg overflow-hidden border-2 border-amber-200 mb-8">
            <div className="px-6 py-4 border-b border-amber-200 bg-amber-100">
              <h2 className="text-xl font-semibold text-amber-900 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-amber-600" />
                Pending Invitations ({pendingInvitations.length})
              </h2>
              <p className="text-sm text-amber-700 mt-1">Teachers who have been invited but haven't signed up yet</p>
            </div>
            <div className="divide-y divide-amber-200">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="p-6 flex items-center justify-between bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-slate-900">{invitation.teacher_name}</h3>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {invitation.teacher_email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Invited {formatDate(invitation.invitation_sent_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Expires {formatDate(invitation.expires_at)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deletePendingInvitation(invitation.id, invitation.teacher_email)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel invitation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* School Members List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Active Members ({members.filter(m => m.status === 'active').length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No teachers in your school yet.</p>
              <p className="text-slate-500 text-sm">Add teachers using the form above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {members.map((member) => (
                <div key={member.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      {member.role === 'owner' ? (
                        <Crown className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <UserCheck className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-slate-900">
                          {member.user_profiles.display_name || member.user_profiles.email}
                        </h3>
                        {member.role === 'owner' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {userRole === 'admin' ? 'Admin' : 'Owner'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {member.user_profiles.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Joined {formatDate(member.joined_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${member.user_profiles.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-600'
                      }`}>
                      {member.user_profiles.subscription_status}
                    </span>

                    {member.role !== 'owner' && (
                      <button
                        onClick={() => removeTeacher(member.member_user_id, member.user_profiles.email)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove teacher"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
