import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const SocialIcons = () => (
  <div className="flex space-x-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
      <Facebook className="w-6 h-6" />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
      <Twitter className="w-6 h-6" />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
      <Instagram className="w-6 h-6" />
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
      <Linkedin className="w-6 h-6" />
    </a>
  </div>
);

export default SocialIcons;