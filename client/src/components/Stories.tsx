import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Add Story */}
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2 cursor-pointer hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs text-gray-600 font-medium">Tambah</p>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
            <div className={`w-16 h-16 rounded-full p-0.5 mb-2 ${
              story.isViewed 
                ? 'bg-gray-300' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              <img
                src={story.image}
                alt={story.user.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <p className="text-xs text-gray-600 font-medium truncate w-16">
              {story.user.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;