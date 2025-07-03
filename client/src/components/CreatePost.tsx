import React, { useState, useRef } from 'react';
import { Image, Smile, MapPin, Calendar, X, Music, Search } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string, image?: string, music?: SpotifyTrack) => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
  image?: string;
  source?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedMusic, setSelectedMusic] = useState<SpotifyTrack | null>(null);
  const [showSpotifySearch, setShowSpotifySearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [spotifyQuery, setSpotifyQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Emoji data
  const emojiCategories = {
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾', '🧉', '🧊'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹‍♀️', '🤹', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
    nature: ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦'],
    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧽', '🚽', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧻', '🪒', '🧼', '🪥', '🪤', '🧺', '🧦', '🧤', '🧣', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧥', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '📿', '💄', '💍', '💎']
  };

  const allEmojis = Object.values(emojiCategories).flat();

  // Search Spotify tracks
  const searchSpotify = async (query: string) => {
    if (!query.trim()) {
      setSpotifyResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const results: SpotifyTrack[] = await response.json();
      setSpotifyResults(results);
    } catch (error) {
      console.error('Error searching Spotify:', error);
      
      // Fallback dengan beberapa hasil mock jika API gagal
      const fallbackResults: SpotifyTrack[] = [
        {
          id: 'fallback-1',
          name: `Hasil untuk "${query}"`,
          artist: 'Artis Demo',
          album: 'Album Demo',
          preview_url: undefined,
          external_urls: { spotify: '#' },
          image: undefined
        }
      ];
      setSpotifyResults(fallbackResults);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle emoji click
  const handleEmojiClick = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle music selection
  const handleMusicSelect = (track: SpotifyTrack) => {
    setSelectedMusic(track);
    setShowSpotifySearch(false);
    setSpotifyQuery('');
    setSpotifyResults([]);
  };

  // Remove selected music
  const handleRemoveMusic = () => {
    setSelectedMusic(null);
  };

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

      onCreatePost(content, imageUrl || undefined, selectedMusic || undefined);
      setContent('');
      setSelectedImage(null);
      setImagePreview('');
      setSelectedMusic(null);
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
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-4">
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
              className="w-full resize-none border-none outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2"
              rows={1}
              onFocus={(e) => {
                e.target.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#374151' : 'white';
                e.target.style.border = '1px solid #e5e7eb';
                e.target.rows = 3;
                e.target.style.borderRadius = '12px';
                e.target.style.padding = '12px';
              }}
              onBlur={(e) => {
                if (!content) {
                  e.target.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6';
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

            {selectedMusic && (
              <div className="mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedMusic.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedMusic.artist} • {selectedMusic.album}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveMusic}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Image className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium hidden sm:inline">Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSpotifySearch(true)}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Music className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium hidden sm:inline">Musik</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center space-x-1 px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium hidden sm:inline">Emoji</span>
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

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-3">
            <div className="flex space-x-2 mb-3 text-xs">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <button
                  key={category}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded capitalize text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => {
                    const element = document.getElementById(`emoji-${category}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {category === 'faces' ? '😀' : category === 'hearts' ? '❤️' : category === 'animals' ? '🐶' : category === 'food' ? '🍎' : category === 'activities' ? '⚽' : category === 'nature' ? '🌍' : '📱'}
                </button>
              ))}
            </div>
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category} id={`emoji-${category}`} className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">{category}</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-8 h-8 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spotify Search Modal */}
      {showSpotifySearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Pilih Musik Spotify</h3>
                <button
                  onClick={() => setShowSpotifySearch(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={spotifyQuery}
                  onChange={(e) => setSpotifyQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchSpotify(spotifyQuery)}
                  placeholder="Cari lagu, artis, atau album..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  onClick={() => searchSpotify(spotifyQuery)}
                  disabled={isSearching}
                  className="absolute right-2 top-1.5 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isSearching ? 'Cari...' : 'Cari'}
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-4">
              {isSearching ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p>Mencari musik...</p>
                  <p className="text-sm">Harap tunggu sebentar</p>
                </div>
              ) : spotifyResults.length > 0 ? (
                <div className="space-y-2">
                  {spotifyResults.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleMusicSelect(track)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {track.image ? (
                          <img 
                            src={track.image} 
                            alt={track.album}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{track.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{track.artist}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{track.album}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            track.source === 'itunes' ? 'bg-gray-800' : 
                            track.source === 'gaama' ? 'bg-blue-500' :
                            track.source === 'seevn' ? 'bg-purple-500' :
                            track.source === 'hunjama' ? 'bg-orange-500' :
                            track.source === 'mtmusic' ? 'bg-red-500' :
                            'bg-green-500'
                          }`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            track.source === 'itunes' ? 'text-gray-800' : 
                            track.source === 'gaama' ? 'text-blue-600' :
                            track.source === 'seevn' ? 'text-purple-600' :
                            track.source === 'hunjama' ? 'text-orange-600' :
                            track.source === 'mtmusic' ? 'text-red-600' :
                            'text-green-600'
                          }`}>
                            {track.source === 'itunes' ? 'iTunes' : 
                             track.source === 'gaama' ? 'Gaama' :
                             track.source === 'seevn' ? 'Seevn' :
                             track.source === 'hunjama' ? 'Hunjama' :
                             track.source === 'mtmusic' ? 'MTMusic' :
                             'Free'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : spotifyQuery && !isSearching ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Tidak ada hasil ditemukan</p>
                  <p className="text-sm">Coba kata kunci yang berbeda</p>
                </div>
              ) : !spotifyQuery ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Cari musik dari Spotify</p>
                  <p className="text-sm">Masukkan nama lagu, artis, atau album</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;