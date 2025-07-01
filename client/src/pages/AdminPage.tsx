import React from 'react';
import { Link } from 'wouter';
import AdminDashboard from '../components/AdminDashboard';
import { mockPosts, mockUsers } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Post as PostType, User } from '../types';

const AdminPage: React.FC = () => {
  const [posts] = useLocalStorage<PostType[]>('posts', mockPosts);
  const [users] = useLocalStorage<User[]>('users', mockUsers);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  <span className="font-medium">Kembali</span>
                </button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="pt-14">
        <AdminDashboard 
          onBackToHome={() => {}}
          users={users as any}
          posts={posts as any}
        />
      </div>
    </div>
  );
};

export default AdminPage;