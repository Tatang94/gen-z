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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Apa yang Anda pikirkan?"
              className="w-full resize-none border-none outline-none text-sm placeholder-gray-500 bg-gray-100 rounded-full px-4 py-3"
              rows={1}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.border = '1px solid #e5e7eb';
                e.target.rows = 3;
              }}
              onBlur={(e) => {
                if (!content) {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.border = 'none';
                  e.target.rows = 1;
                }
              }}
            />
            
            {showImageInput && (
              <div className="mt-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Masukkan URL gambar..."
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        <hr className="my-3 border-gray-200" />

        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Image className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Foto/video</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Perasaan/aktivitas</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;