import React, { useState } from 'react';
import CreateTeacherForm from '../components/CreateTeacherForm';
import CreateQuestionForm from '../components/CreateQuestionForm';
import DashboardFooter from '../components/DashboardFooter';
import { Plus, Users, Database, Shield, LayoutDashboard } from 'lucide-react'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'content'

  const tabClass = (tabName) => 
    `px-5 py-3 text-lg font-semibold transition-colors rounded-t-lg ${
      activeTab === tabName 
        ? 'bg-white text-blue-600 border-b-4 border-blue-600'
        : 'text-gray-600 hover:text-blue-700 hover:bg-gray-200'
    }`;
    
  // --- Simulated KPI Data for Admin Overview (These would be fetched from API) ---
  const adminKpiData = {
      totalUsers: 108, 
      totalInstructors: 3, 
      totalQuestions: 35
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      
      {/* Main Content Wrapper */}
      <div className='flex-grow'> 
        <div className="p-8 pt-24 max-w-7xl mx-auto w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            System Administrator Console
          </h1>
          <p className="text-lg text-gray-600 mb-8">Manage users and oversee content repository.</p>

          {/* 🚀 SECTION 1: ADMIN KPI SUMMARY CARDS */}
          <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  {/* FIX: Corrected typo from 'class className' to 'className' */}
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{adminKpiData.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-2">Students + Instructors + Admins</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Instructors Provisioned</p>
                      <Users className="w-6 h-6 text-red-500" />
                  </div>
                  {/* FIX: Corrected typo from 'class className' to 'className' */}
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{adminKpiData.totalInstructors}</p>
                  <p className="text-xs text-gray-500 mt-2">Authorized to manage content</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">Total Questions</p>
                      <Database className="w-6 h-6 text-green-500" />
                  </div>
                  {/* FIX: Corrected typo from 'class className' to 'className' */}
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{adminKpiData.totalQuestions}</p>
                  <p className="text-xs text-gray-500 mt-2">Total bank size</p>
              </div>
          </section>


          {/* 🚀 SECTION 2: TABBED CONTENT (User Management vs. Content Creation) */}
          <section className="mt-8">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-300 bg-gray-200 rounded-t-lg">
                  <button onClick={() => setActiveTab('user')} className={tabClass('user')}>
                      <Users className="w-5 h-5 inline-block mr-2" /> User & Instructor Provisioning
                  </button>
                  <button onClick={() => setActiveTab('content')} className={tabClass('content')}>
                      <LayoutDashboard className="w-5 h-5 inline-block mr-2" /> Content Creation & Edit
                  </button>
              </div>

              {/* Tab Content */}
              <div className="bg-white p-6 rounded-b-lg shadow-xl border border-t-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      
                      {/* USER MANAGEMENT TAB */}
                      {activeTab === 'user' && (
                          <div className="lg:col-span-1">
                              <CreateTeacherForm />
                          </div>
                      )}
                      
                      {/* CONTENT CREATION TAB */}
                      {activeTab === 'content' && (
                          <div className="lg:col-span-1">
                              <CreateQuestionForm />
                          </div>
                      )}

                  </div>
                  {/* Message for content section */}
                  <p className="text-sm text-gray-500 mt-4">
                      {activeTab === 'user' ? "Instructors created here will automatically gain access to the /instructor dashboard." : "Use the Instructor Console (/instructor) for viewing the full Question Bank."}
                  </p>
              </div>
          </section>


        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default AdminDashboard;