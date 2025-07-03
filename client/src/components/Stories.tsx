import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoriesProps {
  stories: Story[];
  onCreateStory: (imageFile: File) => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, onCreateStory }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateStoryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCreateStory(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-4">
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {/* Add Story */}
        <div className="flex-shrink-0 text-center">
          <div 
            onClick={handleCreateStoryClick}
            className="relative w-16 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Your story"
              className="w-full h-16 object-cover"
            />
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
              <Plus className="w-3 h-3 text-white" />
            </div>
            <div className="p-1">
              <p className="text-[10px] text-gray-900 dark:text-gray-100 font-medium">Buat</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
            <div className="relative w-16 h-24 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
              <img
                src={story.image}
                alt={story.user.displayName}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-blue-600'
              }`}>
                <img
                  src={story.user.avatar}
                  alt={story.user.displayName}
                  className="w-full h-full rounded-full object-cover border border-white"
                />
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-[10px] text-white font-medium truncate drop-shadow-lg">
                  {story.user.displayName.split(' ')[0]}
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