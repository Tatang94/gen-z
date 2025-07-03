import React, { useState, useRef } from 'react';
import { Image, Smile, MapPin, Calendar, X } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsUploading(true);
    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      onCreatePost(content, imageUrl || undefined);
      setContent('');
      setSelectedImage(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Gagal mengupload gambar. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Apa yang Anda pikirkan?"
              className="w-full resize-none border-none outline-none text-sm placeholder-gray-500 bg-gray-100 rounded-full px-3 py-2"
              rows={1}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.border = '1px solid #e5e7eb';
                e.target.rows = 3;
                e.target.style.borderRadius = '12px';
                e.target.style.padding = '12px';
              }}
              onBlur={(e) => {
                if (!content) {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.border = 'none';
                  e.target.rows = 1;
                  e.target.style.borderRadius = '24px';
                  e.target.style.padding = '8px 12px';
                }
              }}
            />
            
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        <hr className="my-3 border-gray-200" />

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Image className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium hidden sm:inline">Foto</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium hidden sm:inline">Perasaan</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isUploading}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 text-sm"
          >
            {isUploading ? 'Mengupload...' : 'Kirim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;