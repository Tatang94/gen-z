// GenZ Social Media App - JavaScript
class GenZApp {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.stories = [];
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.initializeIcons();
        this.showSplashScreen();
        this.setupEventListeners();
        this.loadData();
    }

    initializeIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    showSplashScreen() {
        setTimeout(() => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            this.checkMobile();
        }, 2000);
    }

    checkMobile() {
        const isMobile = window.innerWidth < 1024;
        document.body.classList.toggle('pb-16', isMobile);
    }

    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => this.checkMobile());

        // Navigation buttons
        document.getElementById('search-btn')?.addEventListener('click', () => this.showSearchPage());
        document.getElementById('notifications-btn')?.addEventListener('click', () => this.showNotifications());
        document.getElementById('profile-btn')?.addEventListener('click', () => this.showProfilePage());

        // Mobile navigation
        this.setupMobileNavigation();

        // Post creation
        this.setupPostCreation();

        // Story creation
        this.setupStoryCreation();
    }

    setupMobileNavigation() {
        const navButtons = document.querySelectorAll('.mobile-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    setupPostCreation() {
        const createPostBtn = document.querySelector('.create-post-btn');
        const postTextarea = document.querySelector('.post-textarea');
        const postImageBtn = document.querySelector('.post-image-btn');
        const postMusicBtn = document.querySelector('.post-music-btn');
        const postEmojiBtn = document.querySelector('.post-emoji-btn');

        createPostBtn?.addEventListener('click', () => this.showCreatePostModal());
        postImageBtn?.addEventListener('click', () => this.handleImageUpload());
        postMusicBtn?.addEventListener('click', () => this.showMusicPicker());
        postEmojiBtn?.addEventListener('click', () => this.showEmojiPicker());
    }

    setupStoryCreation() {
        const addStoryBtn = document.querySelector('.add-story-btn');
        addStoryBtn?.addEventListener('click', () => this.showCreateStoryModal());
    }

    async loadData() {
        try {
            await this.loadPosts();
            await this.loadStories();
            this.renderPosts();
            this.renderStories();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Gagal memuat data. Silakan coba lagi.');
        }
    }

    async loadPosts() {
        try {
            const response = await fetch('/api/posts.php');
            if (!response.ok) throw new Error('Failed to load posts');
            this.posts = await response.json();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.posts = [];
        }
    }

    async loadStories() {
        try {
            const response = await fetch('/api/stories.php');
            if (!response.ok) throw new Error('Failed to load stories');
            this.stories = await response.json();
        } catch (error) {
            console.error('Error loading stories:', error);
            this.stories = [];
        }
    }

    renderPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;

        if (this.posts.length === 0) {
            postsContainer.innerHTML = this.getEmptyStateHTML('posts');
            return;
        }

        const postsHTML = this.posts.map(post => this.getPostHTML(post)).join('');
        postsContainer.innerHTML = postsHTML;
        this.initializeIcons();
    }

    renderStories() {
        const storiesContainer = document.getElementById('stories-container');
        if (!storiesContainer) return;

        let storiesHTML = `
            <div class="flex-shrink-0 text-center">
                <button class="add-story-btn w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 hover:bg-gray-300 transition-colors">
                    <i data-lucide="plus" class="w-6 h-6 text-gray-600"></i>
                </button>
                <span class="text-xs text-gray-500">Tambah Story</span>
            </div>
        `;

        if (this.stories.length === 0) {
            storiesHTML += `
                <div class="flex-shrink-0 text-center ml-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <i data-lucide="image" class="w-6 h-6 text-gray-400"></i>
                    </div>
                    <span class="text-xs text-gray-400">Belum ada story</span>
                </div>
            `;
        } else {
            storiesHTML += this.stories.map(story => this.getStoryHTML(story)).join('');
        }

        storiesContainer.innerHTML = storiesHTML;
        this.initializeIcons();
        this.setupStoryCreation();
    }

    getPostHTML(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        const musicData = post.musicData ? JSON.parse(post.musicData) : null;

        return `
            <div class="bg-white rounded-lg shadow-sm mb-6 fade-in">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                ${post.user.avatar ? 
                                    `<img src="${post.user.avatar}" alt="${post.user.displayName}" class="w-10 h-10 rounded-full object-cover">` :
                                    `<i data-lucide="user" class="w-5 h-5 text-gray-600"></i>`
                                }
                            </div>
                            <div>
                                <div class="flex items-center space-x-1">
                                    <h3 class="font-semibold text-gray-900">${post.user.displayName}</h3>
                                    ${post.user.isVerified ? '<i data-lucide="check-circle" class="w-4 h-4 text-blue-500"></i>' : ''}
                                </div>
                                <p class="text-sm text-gray-500">@${post.user.username} · ${timeAgo}</p>
                            </div>
                        </div>
                        <button class="p-2 hover:bg-gray-100 rounded-full">
                            <i data-lucide="more-horizontal" class="w-5 h-5 text-gray-600"></i>
                        </button>
                    </div>

                    ${post.content ? `<p class="text-gray-900 mb-3 post-content">${post.content}</p>` : ''}

                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}

                    ${musicData ? `
                        <div class="bg-gray-50 rounded-lg p-3 mb-3 flex items-center space-x-3">
                            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="music" class="w-6 h-6 text-white"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-900">${musicData.name}</h4>
                                <p class="text-sm text-gray-500">${musicData.artist}</p>
                            </div>
                            <button class="play-music-btn p-2 hover:bg-white rounded-full" data-music='${JSON.stringify(musicData)}'>
                                <i data-lucide="play" class="w-5 h-5 text-purple-600"></i>
                            </button>
                        </div>
                    ` : ''}

                    <div class="post-actions">
                        <button class="post-action-btn like-btn ${post.isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                            <i data-lucide="heart" class="w-5 h-5"></i>
                            <span>${post.likes || 0}</span>
                        </button>
                        <button class="post-action-btn comment-btn" data-post-id="${post.id}">
                            <i data-lucide="message-circle" class="w-5 h-5"></i>
                            <span>${post.comments?.length || 0}</span>
                        </button>
                        <button class="post-action-btn share-btn ${post.isShared ? 'shared' : ''}" data-post-id="${post.id}">
                            <i data-lucide="share" class="w-5 h-5"></i>
                            <span>${post.shares || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getStoryHTML(story) {
        const timeAgo = this.getTimeAgo(story.timestamp);
        
        return `
            <div class="flex-shrink-0 text-center ml-4">
                <div class="story-item ${story.isViewed ? 'viewed' : 'unviewed'}" data-story-id="${story.id}">
                    <img src="${story.image}" alt="${story.user.displayName}" class="w-16 h-16 rounded-full object-cover">
                </div>
                <span class="text-xs text-gray-500 block mt-1">${story.user.displayName}</span>
            </div>
        `;
    }

    getEmptyStateHTML(type) {
        const configs = {
            posts: {
                icon: 'message-square',
                title: 'Belum ada postingan',
                description: 'Jadilah yang pertama membuat postingan di komunitas GenZ!',
                buttonText: 'Buat Postingan Pertama',
                buttonClass: 'create-post-btn'
            },
            stories: {
                icon: 'camera',
                title: 'Belum ada story',
                description: 'Bagikan momen spesial Anda dengan story!',
                buttonText: 'Buat Story Pertama',
                buttonClass: 'add-story-btn'
            }
        };

        const config = configs[type];
        return `
            <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${config.icon}" class="w-8 h-8 text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${config.title}</h3>
                <p class="text-gray-500 mb-4">${config.description}</p>
                <button class="${config.buttonClass} btn-primary">
                    ${config.buttonText}
                </button>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
        return `${Math.floor(diffInSeconds / 31536000)}y`;
    }

    showCreatePostModal() {
        // Create and show modal for post creation
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                <div class="p-4 border-b">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold">Buat Postingan</h2>
                        <button class="close-modal p-2 hover:bg-gray-100 rounded-full">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <textarea 
                        class="w-full p-3 border rounded-lg resize-none" 
                        rows="4" 
                        placeholder="Apa yang kamu pikirkan?"
                        id="post-content"
                    ></textarea>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex space-x-2">
                            <button class="p-2 hover:bg-gray-100 rounded-full" title="Tambah Foto">
                                <i data-lucide="image" class="w-5 h-5 text-gray-600"></i>
                            </button>
                            <button class="p-2 hover:bg-gray-100 rounded-full" title="Tambah Musik">
                                <i data-lucide="music" class="w-5 h-5 text-gray-600"></i>
                            </button>
                            <button class="p-2 hover:bg-gray-100 rounded-full" title="Tambah Emoji">
                                <i data-lucide="smile" class="w-5 h-5 text-gray-600"></i>
                            </button>
                        </div>
                        <button class="btn-primary create-post-submit">Posting</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.initializeIcons();

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.create-post-submit').addEventListener('click', () => {
            const content = modal.querySelector('#post-content').value.trim();
            if (content) {
                this.createPost({ content });
                document.body.removeChild(modal);
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showCreateStoryModal() {
        // Create and show modal for story creation
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full mx-4">
                <div class="p-4 border-b">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold">Buat Story</h2>
                        <button class="close-modal p-2 hover:bg-gray-100 rounded-full">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i data-lucide="image" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                        <p class="text-gray-500 mb-4">Pilih gambar untuk story Anda</p>
                        <input type="file" accept="image/*" class="hidden" id="story-image">
                        <button class="btn-primary select-image-btn">Pilih Gambar</button>
                    </div>
                    <button class="btn-primary w-full mt-4 create-story-submit" disabled>Buat Story</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.initializeIcons();

        // Event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.select-image-btn').addEventListener('click', () => {
            modal.querySelector('#story-image').click();
        });

        modal.querySelector('#story-image').addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                modal.querySelector('.create-story-submit').disabled = false;
            }
        });

        modal.querySelector('.create-story-submit').addEventListener('click', () => {
            const fileInput = modal.querySelector('#story-image');
            if (fileInput.files && fileInput.files[0]) {
                // In a real app, you would upload the file
                // For now, we'll just show a success message
                this.showSuccess('Story berhasil dibuat!');
                document.body.removeChild(modal);
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    async createPost(postData) {
        try {
            const response = await fetch('/api/posts.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) throw new Error('Failed to create post');

            const newPost = await response.json();
            this.posts.unshift(newPost);
            this.renderPosts();
            this.showSuccess('Postingan berhasil dibuat!');
        } catch (error) {
            console.error('Error creating post:', error);
            this.showError('Gagal membuat postingan. Silakan coba lagi.');
        }
    }

    navigateToPage(page) {
        this.currentPage = page;
        // Update navigation state
        const navButtons = document.querySelectorAll('.mobile-nav-btn');
        navButtons.forEach(btn => {
            btn.classList.toggle('text-purple-600', btn.dataset.page === page);
            btn.classList.toggle('text-gray-600', btn.dataset.page !== page);
        });

        // Show appropriate content
        switch (page) {
            case 'home':
                this.showHomePage();
                break;
            case 'search':
                this.showSearchPage();
                break;
            case 'chat':
                this.showChatPage();
                break;
            case 'profile':
                this.showProfilePage();
                break;
            case 'more':
                this.showMorePage();
                break;
        }
    }

    showHomePage() {
        // Already implemented in main HTML
        console.log('Navigating to home page');
    }

    showSearchPage() {
        console.log('Navigating to search page');
        this.showInfo('Fitur pencarian akan segera tersedia!');
    }

    showChatPage() {
        console.log('Navigating to chat page');
        this.showInfo('Fitur chat akan segera tersedia!');
    }

    showProfilePage() {
        console.log('Navigating to profile page');
        this.showInfo('Fitur profil akan segera tersedia!');
    }

    showMorePage() {
        console.log('Navigating to more page');
        this.showInfo('Menu tambahan akan segera tersedia!');
    }

    showNotifications() {
        this.showInfo('Fitur notifikasi akan segera tersedia!');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showInfo(message) {
        this.showToast(message, 'info');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        toast.className += ` ${colors[type]}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GenZApp();
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
});