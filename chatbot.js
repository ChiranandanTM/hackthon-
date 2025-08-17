// chatbot.js
// This script injects a chatbot widget into the current webpage and handles communication
// with the Python backend server.

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Create and Inject the Chatbot UI ---

    // Create a container for the chatbot elements
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-container';

    // The HTML structure for the chatbot widget
    chatContainer.innerHTML = `
        <div id="chat-widget" class="chat-widget">
            <div id="chat-header" class="chat-header">
                <h2>AI Assistant</h2>
                <button id="close-chat" class="close-chat-btn">&times;</button>
            </div>
            <div id="chat-body" class="chat-body">
                <div class="chat-message bot">
                    <p>Hello! How can I help you today? If this is an emergency, please call your local emergency number immediately.</p>
                </div>
            </div>
            <div id="chat-footer" class="chat-footer">
                <input type="text" id="chat-input" placeholder="Type a message...">
                <button id="send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <button id="chat-toggle-btn" class="chat-toggle-btn">
            <i class="fas fa-comments"></i>
            <i class="fas fa-times" style="display: none;"></i>
        </button>
    `;

    // Append the chatbot container to the page's body
    document.body.appendChild(chatContainer);

    // --- 2. Inject the CSS for Styling ---

    // Create a style element
    const style = document.createElement('style');
    // CSS styles for the chatbot widget. Using a template literal for multiline string.
    style.innerHTML = `
        :root {
            --chatbot-primary: #007bff;
            --chatbot-light: #fff;
            --chatbot-dark: #333;
            --chatbot-bg: #f4f7f9;
        }
        #chatbot-container {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 1001;
            font-family: 'Inter', sans-serif;
        }
        .chat-toggle-btn {
            background-color: var(--chatbot-primary);
            color: var(--chatbot-light);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            transition: all 0.3s ease;
        }
        .chat-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
        }
        .chat-widget {
            width: 350px;
            max-width: 90vw;
            height: 500px;
            max-height: 80vh;
            background: var(--chatbot-light);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.5);
            opacity: 0;
            transform-origin: bottom right;
            transition: transform 0.3s ease, opacity 0.3s ease;
            display: none; /* Initially hidden */
        }
        .chat-widget.open {
            display: flex;
            transform: scale(1);
            opacity: 1;
        }
        .chat-header {
            background-color: var(--chatbot-primary);
            color: var(--chatbot-light);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chat-header h2 {
            margin: 0;
            font-size: 1.2rem;
        }
        .close-chat-btn {
            background: none;
            border: none;
            color: var(--chatbot-light);
            font-size: 24px;
            cursor: pointer;
        }
        .chat-body {
            flex-grow: 1;
            padding: 20px;
            overflow-y: auto;
            background-color: var(--chatbot-bg);
        }
        .chat-message {
            margin-bottom: 15px;
            display: flex;
        }
        .chat-message p {
            margin: 0;
            padding: 10px 15px;
            border-radius: 18px;
            max-width: 80%;
            line-height: 1.5;
        }
        .chat-message.user {
            justify-content: flex-end;
        }
        .chat-message.user p {
            background-color: var(--chatbot-primary);
            color: var(--chatbot-light);
            border-bottom-right-radius: 4px;
        }
        .chat-message.bot p {
            background-color: #e9ecef;
            color: var(--chatbot-dark);
            border-bottom-left-radius: 4px;
        }
        .chat-message.bot.loading p {
            display: flex;
            align-items: center;
        }
        .chat-message.bot.loading p span {
            height: 8px;
            width: 8px;
            margin: 0 2px;
            background-color: #999;
            border-radius: 50%;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .chat-message.bot.loading p span:nth-child(1) { animation-delay: -0.32s; }
        .chat-message.bot.loading p span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
        }
        .chat-footer {
            display: flex;
            padding: 10px 20px;
            border-top: 1px solid #ddd;
        }
        #chat-input {
            flex-grow: 1;
            border: 1px solid #ccc;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
        }
        #chat-input:focus {
            border-color: var(--chatbot-primary);
        }
        #send-btn {
            background-color: var(--chatbot-primary);
            color: var(--chatbot-light);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-left: 10px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        #send-btn:hover {
            background-color: #0056b3;
        }
    `;
    // Append the styles to the document's head
    document.head.appendChild(style);


    // --- 3. Add Event Listeners and Logic ---

    // Get references to the UI elements
    const chatWidget = document.getElementById('chat-widget');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const toggleIcons = toggleBtn.querySelectorAll('i');

    // Function to toggle the chat window
    const toggleChat = () => {
        chatWidget.classList.toggle('open');
        toggleIcons[0].style.display = chatWidget.classList.contains('open') ? 'none' : 'block';
        toggleIcons[1].style.display = chatWidget.classList.contains('open') ? 'block' : 'none';
    };

    // Event listeners for opening and closing the chat
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Function to handle sending a message
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Display user's message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show loading indicator
        const loadingIndicator = addMessage('', 'bot', true);
        let response; // Define response here to access it in the catch block

        try {
            // Get page context to send to the bot
            const pageContext = `The user is currently on the page with the title: "${document.title}".`;

            // Send message to the Python backend
            response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message, context: pageContext }),
            });

            // ***IMPROVED ERROR HANDLING***
            // Check if the response status is not OK (e.g., 400, 500)
            if (!response.ok) {
                // Try to get the specific error message from the backend
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Remove loading indicator and display bot's reply
            loadingIndicator.remove();
            addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error:', error);
            // Remove loading indicator
            loadingIndicator.remove();
            // Display a more specific error message if available, otherwise a generic one
            const errorMessage = error.message.includes("Failed to fetch") 
                ? "Sorry, I can't connect to the server. Please ensure the Python server is running."
                : `Sorry, an error occurred: ${error.message}`;
            addMessage(errorMessage, 'bot');
        }
    };

    // Event listeners for sending a message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to add a message to the chat body
    function addMessage(text, sender, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const p = document.createElement('p');
        if (isLoading) {
            messageDiv.classList.add('loading');
            p.innerHTML = '<span></span><span></span><span></span>';
        } else {
            // A simple way to format markdown-like bold and lists
            let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
            formattedText = formattedText.replace(/^\* (.*$)/gm, '<li>$1</li>'); // List items
            if (formattedText.includes('<li>')) {
                formattedText = `<ul>${formattedText}</ul>`;
            }
            p.innerHTML = formattedText;
        }
        
        messageDiv.appendChild(p);
        chatBody.appendChild(messageDiv);
        // Scroll to the bottom of the chat
        chatBody.scrollTop = chatBody.scrollHeight;
        return messageDiv;
    }
});