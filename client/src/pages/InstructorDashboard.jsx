import React from 'react';
import CreateQuestionForm from '../components/CreateQuestionForm';
import QuestionList from '../components/QuestionList'; 
import StudentAnalyticsTable from '../components/StudentAnalyticsTable'; // 👈 Import the new component

const InstructorDashboard = () => {
  return (
    // Added padding top to ensure content sits below the fixed Navbar
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor Console</h1>
        
        {/* 🚀 Section 1: Student Analytics and Performance Overview (The primary feature) */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Performance Overview</h2>
            <StudentAnalyticsTable /> {/* 👈 Render the full analytics table */}
        </section>

        {/* 🚀 Section 2: Question Management (Create and View) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Column 1: Create Question Form */}
          <div className="lg:col-span-1">
            <CreateQuestionForm />
          </div>

          {/* Column 2: Question Bank List */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Bank</h2>
              <QuestionList /> 
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default InstructorDashboard;