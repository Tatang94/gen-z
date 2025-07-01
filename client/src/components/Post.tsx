import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { Post as PostType } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onShare, onFollow }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
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
                <h3 className="font-semibold text-gray-900 text-sm">{post.user.displayName}</h3>
                {post.user.isVerified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-xs">{formatTimeAgo(post.timestamp)} • 🌐</p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Post Content */}
        <div className="mt-2">
          <p className="text-gray-900 text-sm leading-relaxed">{post.content}</p>
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
              <input
                type="text"
                placeholder="Tulis komentar..."
                className="w-full p-2 bg-white border border-gray-200 rounded-full outline-none focus:border-blue-500 transition-colors text-sm"
              />
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