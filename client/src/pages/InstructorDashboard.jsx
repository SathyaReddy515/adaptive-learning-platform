import React, { useState } from 'react'; // 👈 Import useState
import CreateQuestionForm from '../components/CreateQuestionForm';
import QuestionList from '../components/QuestionList'; 
import StudentAnalyticsTable from '../components/StudentAnalyticsTable'; 
import DashboardFooter from '../components/DashboardFooter';
import { Plus, List, Database, TrendingUp, Users, Target } from 'lucide-react'; // New icons

const InstructorDashboard = () => {
  // 🚀 NEW STATE: Manages the active view for content (Create or List)
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'list', 'create'

  const tabClass = (tabName) => 
    `px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
      activeTab === tabName 
        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`;
    
  // --- Simulated KPI Data (In a production app, these would be fetched) ---
  const kpiData = {
      masteryRate: 72, // 72% of topics mastered by the cohort
      studentsBehind: 5, // Students with Avg Mastery < 40%
      totalQuestions: 35 // Total questions in the bank
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        
        {/* Main Content Wrapper */}
        <div className="p-8 pt-24 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Instructor Console</h1>
            
            {/* 🚀 SECTION 1: KPI CARDS */}
            <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Cohort Mastery Rate</p>
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpiData.masteryRate}%</p>
                    <p className="text-xs text-gray-500 mt-2">Overall topics mastered</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">Students Needing Help</p>
                        <Users className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1">{kpiData.studentsBehind}</p>
                    <p className="text-xs text-gray-500 mt-2">Below 40% average mastery</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-500">Total Question Bank</p>
                        <Database className="w-6 h-6 text-green-500" />
                    </div>
                    <p class="text-3xl font-extrabold text-gray-900 mt-1">{kpiData.totalQuestions}</p>
                    <p class="text-xs text-gray-500 mt-2">Available for adaptive quizzes</p>
                </div>
            </section>

            {/* 🚀 SECTION 2: STUDENT ANALYTICS TABLE */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                    <Target className="w-7 h-7 mr-2 text-blue-600"/> Student Performance Overview
                </h2>
                <StudentAnalyticsTable />
            </section>

            {/* 🚀 SECTION 3: CONTENT MANAGEMENT TABS */}
            <section>
                <div className="flex justify-between items-center bg-gray-200 p-2 rounded-t-lg border-b">
                    {/* Tabs */}
                    <div className="flex space-x-2">
                        <button onClick={() => setActiveTab('list')} className={tabClass('list')}>
                            <List className="w-5 h-5 inline-block mr-1" /> View Question List
                        </button>
                        <button onClick={() => setActiveTab('create')} className={tabClass('create')}>
                            <Plus className="w-5 h-5 inline-block mr-1" /> Create New Question
                        </button>
                    </div>
                    
                    {/* Floating Create Button for Quick Access */}
                    <button 
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 flex items-center transition-colors"
                    >
                         <Plus className="w-5 h-5 mr-1" /> Add Question
                    </button>
                </div>

                <div className="bg-white p-6 rounded-b-lg shadow-xl border">
                    {activeTab === 'list' && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Question Bank</h3>
                            <QuestionList />
                        </div>
                    )}
                    {activeTab === 'create' && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">New Question Creation</h3>
                            <CreateQuestionForm />
                        </div>
                    )}
                    {activeTab === 'analytics' && (
                         <div className="p-8 text-center text-gray-500">Select a tab above to manage content.</div>
                    )}
                </div>
            </section>

        </div>
        
        <DashboardFooter /> {/* Footer remains at the bottom */}
    </div>
  );
};

export default InstructorDashboard;