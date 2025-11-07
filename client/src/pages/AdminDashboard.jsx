import React from 'react';
import CreateTeacherForm from '../components/CreateTeacherForm';
import CreateQuestionForm from '../components/CreateQuestionForm'; // 👈 1. Import (This was missing)

const AdminDashboard = () => {
  return (
    // Added pt-24 for padding below the fixed Navbar
    <div className="min-h-screen bg-gray-100 p-8 pt-24"> 
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Use lg:grid-cols-2 to stack them on medium screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Column 1: Create Question Form */}
          <div className="lg:col-span-1">
            <CreateQuestionForm /> {/* 👈 2. Add the Question form */}
          </div>

          {/* Column 2: Create Teacher Form */}
          <div className="lg:col-span-1">
            <CreateTeacherForm /> {/* 👈 3. Add the Teacher form */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;