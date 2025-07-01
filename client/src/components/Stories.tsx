import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex space-x-3 overflow-x-auto">
        {/* Add Story */}
        <div className="flex-shrink-0 text-center">
          <div className="relative w-20 h-28 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Your story"
              className="w-full h-20 object-cover"
            />
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-900 font-medium">Buat cerita</p>
            </div>
          </div>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
            <div className="relative w-20 h-28 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
              <img
                src={story.image}
                alt={story.user.displayName}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 w-8 h-8 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-blue-600'
              }`}>
                <img
                  src={story.user.avatar}
                  alt={story.user.displayName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs text-white font-medium truncate drop-shadow-lg">
                  {story.user.displayName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;