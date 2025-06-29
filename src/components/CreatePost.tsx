import React, { useState } from 'react';
import { Image, Smile, MapPin, Calendar } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreatePost(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Apa yang sedang kamu pikirkan?"
              className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 bg-transparent"
              rows={3}
            />
            
            {showImageInput && (
              <div className="mt-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Masukkan URL gambar..."
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium">Foto</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Smile className="w-5 h-5" />
              <span className="text-sm font-medium">Emoji</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Lokasi</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Posting
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;