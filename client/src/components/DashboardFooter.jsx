import React from 'react';
import { Link } from 'react-router-dom';

const DashboardFooter = () => (
    <footer className="w-full bg-white border-t mt-8 p-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Learnify Platform. All rights reserved.</p>
            <div className="space-x-4">
                <Link to="/profile-settings" className="hover:text-blue-600">Profile</Link>
                <Link to="/" className="hover:text-blue-600">Go to Home</Link>
            </div>
        </div>
    </footer>
);

export default DashboardFooter;