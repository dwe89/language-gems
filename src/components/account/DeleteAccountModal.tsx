import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useRouter } from 'next/navigation';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'teacher' | 'student';
}

export default function DeleteAccountModal({ isOpen, onClose, userType }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!user) {
      setError('No user found');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign out user and redirect to homepage
        await signOut();
        router.push('/');
      } else {
        setError(data.error || 'Failed to delete account');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This action cannot be undone. This will permanently delete your account and remove all data.
          </p>
          
          {userType === 'teacher' && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm font-medium">
                ⚠️ Warning: This will also delete ALL students you created and ALL their progress data.
              </p>
            </div>
          )}

          <p className="text-gray-700 mb-2">
            Please type <strong>DELETE</strong> to confirm:
          </p>
          
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type DELETE here"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText !== 'DELETE'}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
