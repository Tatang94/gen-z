import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ThumbsUp, Play, Pause, Volume2, Flag, UserMinus, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { Post as PostType } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
  onComment?: (postId: string, content: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onShare, onFollow, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={post.user.avatar}
              alt={post.user.displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{post.user.displayName}</h3>
                {post.user.isVerified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{formatTimeAgo(post.timestamp)} • 🌐</p>
            </div>
          </div>
          <div className="relative z-10" ref={menuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showMoreMenu && (
              <div className="absolute right-0 top-8 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] py-2 max-h-80 overflow-y-auto" style={{position: 'fixed', right: '20px', top: '60px'}}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/post/' + post.id);
                    alert('Link postingan disalin!');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm"
                >
                  <Copy size={16} />
                  <span>Salin link</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Laporkan postingan ini?')) {
                      alert('Postingan telah dilaporkan');
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm text-red-600 border-t border-gray-200 dark:border-gray-600"
                >
                  <Flag size={16} />
                  <span>Laporkan</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Sembunyikan postingan dari ' + post.user.displayName + '?')) {
                      alert('Postingan disembunyikan');
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm text-orange-600 border-t border-gray-200 dark:border-gray-600"
                >
                  <UserMinus size={16} />
                  <span>Sembunyikan</span>
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Hapus postingan ini? Tindakan ini tidak dapat dibatalkan.')) {
                      try {
                        const response = await fetch(`/api/posts/${post.id}`, {
                          method: 'DELETE',
                        });
                        
                        if (response.ok) {
                          alert('Postingan berhasil dihapus');
                          window.location.reload(); // Refresh page to update posts
                        } else {
                          alert('Gagal menghapus postingan');
                        }
                      } catch (error) {
                        console.error('Error deleting post:', error);
                        alert('Gagal menghapus postingan');
                      }
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm text-red-600 border-t border-gray-200 dark:border-gray-600 font-medium"
                >
                  <Trash2 size={16} />
                  <span>Hapus postingan</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-2">
          {post.content && (
            <p className="text-gray-900 dark:text-white text-sm leading-relaxed">{post.content}</p>
          )}
          
          {/* Music Player */}
          {((post as any).music && typeof (post as any).music === 'string' ? JSON.parse((post as any).music) : (post as any).music) && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {(() => {
                    const musicData = typeof (post as any).music === 'string' ? JSON.parse((post as any).music) : (post as any).music;
                    return (
                      <img
                        src={musicData.image || `https://via.placeholder.com/60x60/8B5CF6/white?text=%E2%99%AA`}
                        alt="Album cover"
                        className="w-12 h-12 rounded-lg object-cover shadow-md"
                      />
                    );
                  })()}
                  <button
                    onClick={() => {
                      const audio = audioRef.current;
                      if (audio) {
                        if (isPlaying) {
                          audio.pause();
                        } else {
                          audio.play().catch(() => {
                            // Handle autoplay restrictions or invalid URLs
                            alert('Tidak dapat memutar audio ini');
                          });
                        }
                        setIsPlaying(!isPlaying);
                      } else {
                        alert('Preview audio tidak tersedia');
                      }
                    }}
                    className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 group"
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-1 group-hover:bg-opacity-30 transition-all">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </div>
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  {(() => {
                    const musicData = typeof (post as any).music === 'string' ? JSON.parse((post as any).music) : (post as any).music;
                    return (
                      <>
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {musicData.name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs truncate">
                          {musicData.artist}
                        </div>
                        <div className="text-gray-500 dark:text-gray-500 text-xs truncate">
                          {musicData.album}
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} className="text-purple-600 dark:text-purple-400" />
                  {(() => {
                    const musicData = typeof (post as any).music === 'string' ? JSON.parse((post as any).music) : (post as any).music;
                    return musicData.external_urls?.spotify && (
                      <a
                        href={musicData.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                      >
                        <ExternalLink size={14} />
                      </a>
                    );
                  })()}
                </div>
              </div>
              
              {/* Hidden Audio Element */}
              {(() => {
                const musicData = typeof (post as any).music === 'string' ? JSON.parse((post as any).music) : (post as any).music;
                return musicData.preview_url && (
                  <audio
                    ref={audioRef}
                    src={musicData.preview_url}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setIsPlaying(false)}
                  />
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="px-0">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-3 h-3 text-blue-500" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>{post.comments.length} komentar</span>
            <span>{post.shares} bagian</span>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-3 py-1 border-t border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => onLike(post.id)}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
              post.isLiked ? 'text-blue-500' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">Suka</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Komentar</span>
          </button>
          
          <button
            onClick={() => onShare(post.id)}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
              post.isShared ? 'text-green-500' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">Bagikan</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Tulis komentar..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) {
                      onComment?.(post.id, commentText.trim());
                      setCommentText('');
                    }
                  }}
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-l-full outline-none focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  onClick={() => {
                    if (commentText.trim()) {
                      onComment?.(post.id, commentText.trim());
                      setCommentText('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
          
          {/* Sample Comments */}
          {post.comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex space-x-3 mt-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <h4 className="font-semibold text-sm text-gray-900">{comment.user.displayName}</h4>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 ml-3">
                  <button className="text-xs text-gray-500 font-medium hover:underline">
                    Suka
                  </button>
                  <button className="text-xs text-gray-500 font-medium hover:underline">
                    Balas
                  </button>
                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;