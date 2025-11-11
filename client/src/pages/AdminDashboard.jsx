import React from 'react';
import CreateTeacherForm from '../components/CreateTeacherForm';
import CreateQuestionForm from '../components/CreateQuestionForm';
import DashboardFooter from '../components/DashboardFooter'; // 👈 Import Footer

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Column 1: Create Question Form */}
          <div className="lg:col-span-1">
            <CreateQuestionForm />
          </div>

          {/* Column 2: Create Teacher Form */}
          <div className="lg:col-span-1">
            <CreateTeacherForm />
          </div>
        </div>
      </div>

      <DashboardFooter /> {/* 👈 Add Footer */}
    </div>
  );
};

export default AdminDashboard;