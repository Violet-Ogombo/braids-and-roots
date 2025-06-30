document.addEventListener("DOMContentLoaded", () => {
  console.log("Script is working!");

  const footer = document.querySelector("footer");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `© ${year} Braids and Roots · All rights reserved`;
  }

  document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('You', userMessage);
    input.value = '';

    appendMessage('Bot', 'Thinking...');

    try {
      const response = await fetch('http://localhost:8888/.netlify/functions/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      console.log('API response:', data);
      document.getElementById('chat-messages').lastChild.textContent = `Bot: ${data.reply}`;
    } catch (err) {
      console.error("Error fetching from chatbot function:", err);
      document.getElementById('chat-messages').lastChild.textContent = 'Bot: Something went wrong.';
    }
  });

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.textContent = `${sender}: ${text}`;
    document.getElementById('chat-messages').appendChild(div);
  }
});

