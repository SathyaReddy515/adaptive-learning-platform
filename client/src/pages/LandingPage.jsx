import React, { useState } from 'react'; // <-- Combined and kept useState here
import axios from 'axios'; // <-- Kept axios here
import { toast } from 'react-hot-toast'; // <-- Kept toast here

import Navbar from '../components/Navbar';
import SocialIcons from '../components/SocialIcons'; 
import { ArrowRight, CheckCircle, Brain, Target, Zap, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const { email, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      // Calls the public contact API endpoint
      await axios.post('http://localhost:5001/api/contact', formData, config);
      
      toast.success('Message sent! We will be in touch soon.');
      setFormData({ email: '', message: '' }); // Clear form
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section (Section ID: home) */}
      <main id="home" className="pt-16">
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Hero Text Content */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  The <span className="text-blue-600">Smarter Way</span> to
                  <br />
                  Master New Skills
                </h1>
                <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                  Our **adaptive learning platform** creates a unique path for every learner. Stop wasting time on what you already know and focus on what's next.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button className="flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-md text-base font-medium hover:bg-blue-700 transition-colors shadow-lg">
                    Get Started <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                  <a href="#features" className="flex items-center justify-center bg-gray-100 text-gray-800 px-8 py-3 rounded-md text-base font-medium hover:bg-gray-200 transition-colors shadow-lg">
                    View Features
                  </a>
                </div>
              </div>
              
              {/* Hero Image / Illustration */}
              <div className="flex justify-center">
                <Brain className="w-64 h-64 text-blue-200" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Section ID: features) */}
        <section id="features" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                How Our Adaptive System Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                A learning experience built just for you, powered by data.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Assessment */}
              <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
                <Target className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-xl font-bold text-gray-900">1. Pinpoint Mastery</h3>
                <p className="mt-2 text-gray-600">
                  We use performance data to calculate your proficiency for every topic, identifying knowledge gaps instantly.
                </p>
              </div>
              {/* Card 2: Adaptation */}
              <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
                <Zap className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-xl font-bold text-gray-900">2. Dynamic Quizzes</h3>
                <p className="mt-2 text-gray-600">
                  Quizzes are generated in real-time, pulling questions that are either one level easier or harder than your current skill level.
                </p>
              </div>
              {/* Card 3: Feedback */}
              <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
                <CheckCircle className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-xl font-bold text-gray-900">3. Targeted Remediation</h3>
                <p className="mt-2 text-gray-600">
                  Instant feedback, detailed explanations, and resource links ensure you understand *why* an answer is correct.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section (Section ID: about) */}
        <section id="about" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Commitment to Learning
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We believe that learning should be efficient and personalized. Our goal is to make every study minute count by focusing on true mastery, not just memorization.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section (Section ID: contact) */}
        <section id="contact" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Get In Touch
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Have questions? Send us a message!
              </p>
            </div>
            
            {/* FUNCTIONAL CONTACT FORM */}
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="c-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" id="c-email" name="email" 
                            placeholder="Your Email" required
                            value={email} onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" 
                        />
                    </div>
                    <div>
                        <label htmlFor="c-message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea 
                            id="c-message" name="message" rows="4" 
                            placeholder="Your Message" required
                            value={message} onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
          </div>
        </section>

        {/* 🚀 UPDATED: Detailed Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Column 1: Company Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Learnify</h3>
                <p className="text-gray-400 text-sm">
                  The Adaptive Learning Platform. Dedicated to mastering skills, not just passing tests.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#home" className="text-gray-400 hover:text-white text-sm">Home</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white text-sm">About Us</a></li>
                  <li><a href="#features" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                </ul>
              </div>

              {/* Column 3: Contact Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <address className="text-gray-400 text-sm not-italic space-y-2">
                  <p>123 Adaptive Blvd, Suite 100</p>
                  <p>Learning City, TE 90210</p>
                  <p>Email: <a href="mailto:support@learnify.com" className="hover:text-white">support@learnify.com</a></p>
                  <p>Phone: (555) 555-5555</p>
                </address>
              </div>

              {/* Column 4: Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <SocialIcons /> 
              </div>
              
            </div>
            
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Learnify. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;