// HD Plumbing Chat Widget
// Self-contained chat widget with AI backend

(function() {
    // Config — Worker URL will be set after deployment
    const WORKER_URL = 'https://hdplumbing-chatbot.airwayclinicproxy.workers.dev';

    // State
    let isOpen = false;
    let messages = [];
    let isTyping = false;
    let initialized = false;

    // Create widget HTML
    function createWidget() {
        // Bubble button
        const bubble = document.createElement('button');
        bubble.className = 'hdp-chat-bubble';
        bubble.id = 'hdpChatBubble';
        bubble.setAttribute('aria-label', 'Open chat');
        bubble.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
        `;

        // Chat window
        const window_ = document.createElement('div');
        window_.className = 'hdp-chat-window';
        window_.id = 'hdpChatWindow';
        window_.innerHTML = `
            <div class="hdp-chat-header">
                <div class="hdp-chat-avatar">🔧</div>
                <div class="hdp-chat-header-info">
                    <h4>HD Plumbing</h4>
                    <span><span class="hdp-online-dot"></span> Typically replies instantly</span>
                </div>
            </div>
            <div class="hdp-chat-messages" id="hdpChatMessages"></div>
            <div class="hdp-quick-replies" id="hdpQuickReplies"></div>
            <div class="hdp-chat-input">
                <input type="text" id="hdpChatInput" placeholder="Type your message..." autocomplete="off">
                <button class="hdp-chat-send" id="hdpChatSend" aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(bubble);
        document.body.appendChild(window_);

        // Event listeners
        bubble.addEventListener('click', toggleChat);
        document.getElementById('hdpChatSend').addEventListener('click', sendMessage);
        document.getElementById('hdpChatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function toggleChat() {
        isOpen = !isOpen;
        const bubble = document.getElementById('hdpChatBubble');
        const window_ = document.getElementById('hdpChatWindow');

        if (isOpen) {
            bubble.classList.add('hdp-open');
            window_.classList.add('hdp-open');
            bubble.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            `;
            if (!initialized) {
                initialized = true;
                showWelcome();
            }
            // Focus input
            setTimeout(() => document.getElementById('hdpChatInput').focus(), 300);
        } else {
            bubble.classList.remove('hdp-open');
            window_.classList.remove('hdp-open');
            bubble.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
            `;
        }
    }

    function showWelcome() {
        addBotMessage("Hi there! 👋 I'm HD Plumbing's assistant. How can I help you today?");
        showQuickReplies([
            'Emergency plumbing',
            'Boiler repair',
            'Bathroom quote',
            'Areas covered',
            'Pricing info'
        ]);
    }

    function addBotMessage(text) {
        messages.push({ role: 'assistant', content: text });
        const container = document.getElementById('hdpChatMessages');
        const div = document.createElement('div');
        div.className = 'hdp-message hdp-message-bot';
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function addUserMessage(text) {
        messages.push({ role: 'user', content: text });
        const container = document.getElementById('hdpChatMessages');
        const div = document.createElement('div');
        div.className = 'hdp-message hdp-message-user';
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        isTyping = true;
        const container = document.getElementById('hdpChatMessages');
        const div = document.createElement('div');
        div.className = 'hdp-message hdp-message-bot hdp-typing-indicator';
        div.innerHTML = '<div class="hdp-typing"><span></span><span></span><span></span></div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function hideTyping() {
        isTyping = false;
        const el = document.querySelector('.hdp-typing-indicator');
        if (el) el.remove();
    }

    function showQuickReplies(options) {
        const container = document.getElementById('hdpQuickReplies');
        container.innerHTML = '';
        options.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'hdp-quick-reply';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                container.innerHTML = '';
                handleUserInput(text);
            });
            container.appendChild(btn);
        });
    }

    function hideQuickReplies() {
        document.getElementById('hdpQuickReplies').innerHTML = '';
    }

    async function sendMessage() {
        const input = document.getElementById('hdpChatInput');
        const text = input.value.trim();
        if (!text || isTyping) return;

        input.value = '';
        hideQuickReplies();
        await handleUserInput(text);
    }

    async function handleUserInput(text) {
        addUserMessage(text);
        showTyping();

        try {
            // Send to Worker backend
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages.slice(-10) }),
            });

            const data = await response.json();
            hideTyping();

            if (data.reply) {
                addBotMessage(data.reply);
            } else {
                addBotMessage("I'm having trouble right now. Please call us on 07828 715982 for immediate help!");
            }
        } catch (error) {
            hideTyping();
            addBotMessage("I'm having trouble connecting. Please call us on 07828 715982 — we're available 24/7!");
        }

        // Show contextual quick replies after response
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        if (lastMsg.includes('call') || lastMsg.includes('book') || lastMsg.includes('quote')) {
            showQuickReplies(['Call 07828 715982', 'Another question']);
        } else {
            showQuickReplies(['Get a quote', 'Emergency help', 'Another question']);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
