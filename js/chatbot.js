class ChatbotWidget {
    constructor(serverUrl = 'https://smellofluxury-chatbot.onrender.com/chat') {
        this.serverUrl = serverUrl;
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        this.hasGreeted = false;
        this.userScrolled = false;
        this.hasNewMessages = false;
        this.isNearBottom = true;
        
        // Updated colors to match website theme
        this.colors = {
            primary: '#c8a97e',        // Gold accent
            secondary: '#a38a5e',      // Dark gold
            light: '#e4d2b7',          // Light gold
            background: '#fdfbf8',     // Background ivory
            text: '#4a4a4a',           // Primary text
            muted: '#7a7a7a'           // Secondary text
        };

        this.loadMarkedJS();
        this.init();
    }

    loadMarkedJS() {
        if (!document.querySelector('script[src*="marked.min.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => {
                // Configure marked options
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: false,
                    mangle: false,
                    sanitize: true
                });
            };
            document.head.appendChild(script);
        }
    }

    init() {
        this.createStyles();
        this.createElements();
        this.attachEventListeners();
        document.body.appendChild(this.container);
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 1000;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chatbot-bubble {
                width: 56px;
                height: 56px;
                background: ${this.colors.primary};
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                box-shadow: 0 4px 12px rgba(200, 169, 126, 0.2);
                transition: all 0.3s ease;
            }
            .chatbot-bubble:hover {
                transform: scale(1.05);
                background: ${this.colors.secondary};
            }

            .chatbot-window {
                position: absolute;
                bottom: 74px;
                right: 0;
                width: 340px;
                height: 480px;
                background: ${this.colors.background};
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s ease;
                border: 1px solid rgba(200, 169, 126, 0.15);
            }
            .chatbot-window.open {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .chatbot-header {
                background: ${this.colors.primary};
                color: white;
                padding: 12px 16px;
                border-radius: 8px 8px 0 0;
                font-size: 16px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: space-between;
                letter-spacing: 0.5px;
            }
            .header-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .bot-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                object-fit: cover;
            }
            .online-indicator {
                width: 6px;
                height: 6px;
                background: #48BB78;
                border-radius: 50%;
                margin-left: 6px;
                box-shadow: 0 0 0 2px ${this.colors.primary};
            }

            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            .chatbot-close:hover {
                opacity: 1;
            }

            .chatbot-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                scroll-behavior: smooth;
                background: ${this.colors.background};
                position: relative;
            }
            .message-bubble {
                max-width: 80%;
                padding: 10px 14px;
                margin: 8px 0;
                border-radius: 6px;
                font-size: 14px;
                line-height: 1.5;
                word-break: break-word;
                animation: slideIn 0.2s ease-out;
                letter-spacing: 0.2px;
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .user-message {
                background: ${this.colors.secondary};
                color: white;
                margin-left: auto;
                box-shadow: 0 2px 6px rgba(163, 138, 94, 0.15);
            }
            .user-message.sticky {
                position: sticky;
                top: 0;
                z-index: 2;
                margin-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 3px 10px rgba(163, 138, 94, 0.2);
            }
            .bot-message {
                background: white;
                color: ${this.colors.text};
                margin-right: auto;
                border: 1px solid rgba(200, 169, 126, 0.1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            }
            .typing-indicator {
                color: ${this.colors.muted};
                font-style: italic;
            }
            
            .new-message-indicator {
                position: absolute;
                bottom: 16px;
                left: 50%;
                transform: translateX(-50%);
                background: ${this.colors.primary};
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                display: none;
                z-index: 3;
                animation: fadeInUp 0.3s ease-out;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translate(-50%, 10px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            .new-message-indicator.visible {
                display: block;
            }

            .chatbot-input {
                padding: 12px;
                border-top: 1px solid rgba(200, 169, 126, 0.1);
                background: ${this.colors.background};
                border-radius: 0 0 8px 8px;
                display: flex;
                gap: 12px;
            }
            .chatbot-input-field {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid ${this.colors.light};
                border-radius: 4px;
                outline: none;
                resize: none;
                font-size: 14px;
                color: ${this.colors.text};
                background: white;
                transition: border-color 0.2s ease;
                max-height: 100px;
                overflow-y: auto;
                font-family: 'Montserrat', sans-serif;
            }
            .chatbot-input-field:focus {
                border-color: ${this.colors.primary};
                box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.1);
            }
            .chatbot-send-btn {
                background: ${this.colors.primary};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
                font-family: 'Montserrat', sans-serif;
                letter-spacing: 0.3px;
            }
            .chatbot-send-btn:hover {
                background: ${this.colors.secondary};
            }
            .chatbot-send-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .welcome-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 30px 0;
                animation: fadeIn 0.5s ease-out;
            }
            .welcome-avatar {
                width: 100 px;
                height: 90px;
                // border-radius: 50%;
                margin-bottom: 20px;
                object-fit: contain;
                filter: drop-shadow(0 0 8px rgba(200, 169, 126, 0.3));
            }
            .welcome-message {
                color: ${this.colors.text};
                font-size: 16px;
                font-weight: 500;
                text-align: center;
                font-family: 'Playfair Display', serif;
                letter-spacing: 0.5px;
                line-height: 1.4;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = 'chatbot-container';

        this.bubble = document.createElement('div');
        this.bubble.className = 'chatbot-bubble';
        this.bubble.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z"/>
            </svg>
        `;

        this.window = document.createElement('div');
        this.window.className = 'chatbot-window';

        this.header = document.createElement('div');
        this.header.className = 'chatbot-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'header-left';
        
        const botAvatar = document.createElement('img');
        botAvatar.className = 'bot-avatar';
        botAvatar.src = './assets/icons/chatbot-bubble.png'; // You can replace this with your bot image URL
        
        this.title = document.createElement('span');
        this.title.textContent = 'SÉRA';
        
        const onlineIndicator = document.createElement('div');
        onlineIndicator.className = 'online-indicator';
        
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'chatbot-close';
        this.closeButton.textContent = '×';

        headerLeft.append(botAvatar, this.title, onlineIndicator);
        this.header.append(headerLeft, this.closeButton);

        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'chatbot-messages';

        this.newMessageIndicator = document.createElement('div');
        this.newMessageIndicator.className = 'new-message-indicator';
        this.newMessageIndicator.textContent = 'New Message ↓';
        this.messagesContainer.appendChild(this.newMessageIndicator);

        this.inputContainer = document.createElement('div');
        this.inputContainer.className = 'chatbot-input';

        this.input = document.createElement('textarea');
        this.input.className = 'chatbot-input-field';
        this.input.placeholder = 'Type a message...';
        this.input.rows = 1;

        this.sendButton = document.createElement('button');
        this.sendButton.className = 'chatbot-send-btn';
        this.sendButton.textContent = 'Send';

        this.header.append(headerLeft, this.closeButton);
        this.inputContainer.append(this.input, this.sendButton);
        this.window.append(this.header, this.messagesContainer, this.inputContainer);
        this.container.append(this.bubble, this.window);
        this.createWelcomeMessage();
    }

    attachEventListeners() {
        this.bubble.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = `${Math.min(this.input.scrollHeight, 100)}px`;
        });

        // Add scroll event listener to detect user scrolling
        this.messagesContainer.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = this.messagesContainer;
            // Check if user is near bottom (within 30px)
            this.isNearBottom = scrollHeight - scrollTop - clientHeight < 30;
            
            if (this.isNearBottom) {
                this.userScrolled = false;
                this.hideNewMessageIndicator();
            } else {
                this.userScrolled = true;
            }

            // Remove sticky class when user scrolls
            if (scrollTop > 10) {
                const stickyElements = this.messagesContainer.querySelectorAll('.user-message.sticky');
                stickyElements.forEach(el => el.classList.remove('sticky'));
            }
        });

        // Add click event to new message indicator
        this.newMessageIndicator.addEventListener('click', () => {
            this.scrollToBottom();
            this.hideNewMessageIndicator();
        });
    }

    createWelcomeMessage() {
        const welcomeContainer = document.createElement('div');
        welcomeContainer.className = 'welcome-container';

        const welcomeAvatar = document.createElement('img');
        welcomeAvatar.className = 'welcome-avatar';
        welcomeAvatar.src = 'https://smellofluxury.in/wp-content/uploads/2025/03/Logo-04-04.svg';

        const welcomeText = document.createElement('div');
        welcomeText.className = 'welcome-message';
        welcomeText.textContent = 'How may I assist you with fragrances today?';

        welcomeContainer.append(welcomeAvatar, welcomeText);
        this.messagesContainer.appendChild(welcomeContainer);
    }

    async sendInitialGreeting() {
        if (this.hasGreeted) return;
        
        this.hasGreeted = true;
        await this.sendMessage('/start', true);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('open', this.isOpen);
        this.bubble.style.opacity = this.isOpen ? '0' : '1';
        if (this.isOpen) {
            this.input.focus();
            this.scrollToBottom();
            this.sendInitialGreeting();
        }
    }

    addMessage(content, isUser = false) {
        // Remove previous sticky class if exists
        const stickyElements = this.messagesContainer.querySelectorAll('.user-message.sticky');
        stickyElements.forEach(el => el.classList.remove('sticky'));
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Make only the latest user message sticky at the top
        if (isUser) {
            messageDiv.classList.add('sticky');
        }
        
        if (!isUser && content === 'Typing...') {
            messageDiv.classList.add('typing-indicator');
            messageDiv.textContent = content;
        } else if (!isUser) {
            // For bot messages, parse markdown
            try {
                // Sanitize and parse markdown
                const sanitizedContent = this.sanitizeMarkdown(content);
                messageDiv.innerHTML = marked.parse(sanitizedContent);
                
                // Add styles for markdown elements
                this.addMarkdownStyles();
            } catch (error) {
                messageDiv.textContent = content;
            }
        } else {
            // User messages remain as plain text
            messageDiv.textContent = content;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messages.push({ content, isUser });
        
        // Reset scroll position to top when adding a new user message
        if (isUser) {
            this.messagesContainer.scrollTop = 0;
            this.userScrolled = false;
        }
        // Show new message indicator if user has scrolled up
        else if (!isUser && this.userScrolled && !this.isNearBottom) {
            this.showNewMessageIndicator();
        } else {
            this.scrollToBottom();
        }
    }

    sanitizeMarkdown(content) {
        // Basic sanitization of markdown content
        return content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<[^>]*>/g, ''); // Remove HTML tags
    }

    addMarkdownStyles() {
        if (!document.getElementById('markdown-styles')) {
            const style = document.createElement('style');
            style.id = 'markdown-styles';
            style.textContent = `
                .bot-message {
                    overflow-x: auto;
                }
                .bot-message code {
                    background: rgba(200, 169, 126, 0.05);
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                .bot-message pre {
                    background: rgba(200, 169, 126, 0.05);
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                }
                .bot-message pre code {
                    background: none;
                    padding: 0;
                }
                .bot-message a {
                    color: ${this.colors.primary};
                    text-decoration: none;
                }
                .bot-message a:hover {
                    text-decoration: underline;
                }
                .bot-message ul, .bot-message ol {
                    padding-left: 20px;
                    margin: 8px 0;
                }
                .bot-message p {
                    margin: 8px 0;
                }
                .bot-message table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 8px 0;
                }
                .bot-message th, .bot-message td {
                    border: 1px solid ${this.colors.light};
                    padding: 6px;
                    text-align: left;
                }
                .bot-message blockquote {
                    border-left: 3px solid ${this.colors.primary};
                    margin: 8px 0;
                    padding-left: 10px;
                    color: ${this.colors.muted};
                }
            `;
            document.head.appendChild(style);
        }
    }

    showLoading() {
        this.isLoading = true;
        this.sendButton.disabled = true;
        this.addMessage('Typing...', false);
    }

    hideLoading() {
        if (this.isLoading) {
            const lastMessage = this.messagesContainer.lastChild;
            if (lastMessage && lastMessage.textContent === 'Typing...') {
                this.messagesContainer.removeChild(lastMessage);
                this.messages.pop();
            }
            this.isLoading = false;
            this.sendButton.disabled = false;
        }
    }

    showNewMessageIndicator() {
        this.newMessageIndicator.classList.add('visible');
        this.hasNewMessages = true;
    }

    hideNewMessageIndicator() {
        this.newMessageIndicator.classList.remove('visible');
        this.hasNewMessages = false;
    }

    scrollToBottom() {
        // Only scroll to bottom if user hasn't manually scrolled up
        if (!this.userScrolled) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    async sendMessage(message = null, isInitial = false) {
        const messageText = message || this.input.value.trim();
        if ((!messageText || this.isLoading) && !isInitial) return;

        if (!isInitial) {
            this.input.value = '';
            this.input.style.height = 'auto';
        }
        
        if (!isInitial) {
            this.addMessage(messageText, true);
        }
        
        this.showLoading();

        try {
            const response = await fetch(this.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.response) {
                throw new Error('Invalid response format');
            }

            this.hideLoading();
            this.addMessage(data.response, false);

        } catch (error) {
            this.hideLoading();
            let errorMessage = 'Sorry, something went wrong. Please try again.';
            if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message.includes('Server error')) {
                errorMessage = 'Server unavailable. Please try again later.';
            }
            this.addMessage(errorMessage, false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatbotWidget();
});
