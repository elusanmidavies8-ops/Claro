document.addEventListener('DOMContentLoaded', () => {
  const conversation = document.getElementById('conversation');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const suggestions = document.getElementById('suggestions');
  const newChatButton = document.getElementById('new-chat');

  if (!conversation || !form || !input || !sendButton) return;

  const messagesKey = 'claro_chat_messages';
  const name = getStoredName();
  let messages = loadMessages();
  let isThinking = false;
  let responseTimer;

  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-avatar').textContent = getInitial(name);

  if (messages.length === 0) {
    messages = [{
      role: 'assistant',
      text: `Hi ${name}. What's one thing you'd like to feel clearer about today?`
    }];
  }

  renderConversation();
  updateSendButton();

  form.addEventListener('submit', event => {
    event.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
    updateSendButton();
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  document.querySelectorAll('[data-prompt]').forEach(button => {
    button.addEventListener('click', () => sendMessage(button.dataset.prompt));
  });

  newChatButton.addEventListener('click', () => {
    window.clearTimeout(responseTimer);
    isThinking = false;
    messages = [{
      role: 'assistant',
      text: `Hi ${name}. What's one thing you'd like to feel clearer about today?`
    }];
    input.value = '';
    input.style.height = 'auto';
    saveMessages();
    renderConversation();
    updateSendButton();
    input.focus();
  });

  function sendMessage(value) {
    const text = value.trim();

    if (!text || isThinking) return;

    messages.push({ role: 'user', text });
    input.value = '';
    input.style.height = 'auto';
    isThinking = true;
    saveMessages();
    renderConversation();
    updateSendButton();

    responseTimer = window.setTimeout(() => {
      messages.push({ role: 'assistant', text: getCoachReply(text) });
      isThinking = false;
      saveMessages();
      renderConversation();
      updateSendButton();
      input.focus();
    }, 650);
  }

  function renderConversation() {
    conversation.replaceChildren();

    messages.forEach(message => {
      const isUser = message.role === 'user';
      const row = document.createElement('article');
      row.className = `message-row${isUser ? ' user-message' : ''}`;

      if (!isUser) {
        const avatar = document.createElement('span');
        avatar.className = 'message-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = 'C';
        row.append(avatar);
      }

      const body = document.createElement('div');
      body.className = 'message-body';

      const meta = document.createElement('div');
      meta.className = 'message-meta';

      const author = document.createElement('span');
      author.className = 'message-author';
      author.textContent = isUser ? 'You' : 'Claro';
      meta.append(author);

      const copy = document.createElement('p');
      copy.className = 'message-copy';
      copy.textContent = message.text;
      body.append(meta, copy);
      row.append(body);
      conversation.append(row);
    });

    if (isThinking) {
      const typingRow = document.createElement('div');
      typingRow.className = 'message-row';
      typingRow.setAttribute('aria-label', 'Claro is replying');

      const avatar = document.createElement('span');
      avatar.className = 'message-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = 'C';

      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.innerHTML = '<span></span><span></span><span></span>';
      typingRow.append(avatar, indicator);
      conversation.append(typingRow);
    }

    suggestions.hidden = isThinking || messages.some(message => message.role === 'user');
    conversation.scrollTop = conversation.scrollHeight;
  }

  function updateSendButton() {
    sendButton.disabled = isThinking || !input.value.trim();
    sendButton.classList.toggle('is-loading', isThinking);
    sendButton.setAttribute('aria-label', isThinking ? 'Claro is replying' : 'Send message');
  }

  function getCoachReply(text) {
    const normalized = text.toLowerCase();

    if (/overwhelm|too much|stressed|anxious|stuck/.test(normalized)) {
      return "Let's make this feel smaller. Take a breath, then name everything competing for your attention. We'll choose just one useful first step, small enough to begin in ten minutes.";
    }

    if (/focus|distract|concentrat/.test(normalized)) {
      return "Try choosing one task and giving it your full attention for ten minutes. Put one distraction out of reach, decide what the very first action is, and start there. What task matters most right now?";
    }

    if (/plan|today|schedule|time|priorit/.test(normalized)) {
      return "Let's keep the plan realistic: choose one important task, one quick win, and a proper break. Which task would make the biggest difference if you moved it forward today?";
    }

    return "Thanks for sharing that. We can work through it one step at a time. What feels like the most important part to untangle first?";
  }

  function getStoredName() {
    try {
      return window.localStorage.getItem('claro_name')?.trim() || 'Friend';
    } catch {
      return 'Friend';
    }
  }

  function getInitial(value) {
    return Array.from(value.trim())[0]?.toUpperCase() || 'F';
  }

  function loadMessages() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(messagesKey) || '[]');
      if (!Array.isArray(saved)) return [];

      return saved
        .filter(message => (
          message &&
          (message.role === 'assistant' || message.role === 'user') &&
          typeof message.text === 'string'
        ))
        .slice(-200);
    } catch {
      return [];
    }
  }

  function saveMessages() {
    try {
      window.localStorage.setItem(messagesKey, JSON.stringify(messages));
    } catch {
      // Keep the current conversation usable when browser storage is unavailable.
    }
  }
});