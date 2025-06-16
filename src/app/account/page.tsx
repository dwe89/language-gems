'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { User, ShoppingBag, Settings, CreditCard, Crown, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to view your account</h2>
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

  const accountSections = [
    {
      title: 'My Orders',
      description: 'View your purchase history and download your resources',
      icon: ShoppingBag,
      href: '/account/orders',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile, password, and preferences',
      icon: Settings,
      href: '/account/settings',
      color: 'from-slate-500 to-slate-600'
    },
    {
      title: 'Upgrade to Premium',
      description: 'Access the full dashboard and premium features',
      icon: Crown,
      href: '/account/upgrade',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
              <p className="text-slate-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.title}
                href={section.href}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {section.title}
                </h3>
                
                <p className="text-slate-600 mb-4">
                  {section.description}
                </p>
                
                <div className="flex items-center text-indigo-600 group-hover:text-indigo-700">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Account Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
              <div className="text-slate-600">Total Orders</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">£0.00</div>
              <div className="text-slate-600">Total Spent</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-slate-600">Downloaded Resources</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent Activity</h2>
          
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No recent activity</h3>
            <p className="text-slate-500 mb-6">Start shopping to see your activity here</p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 