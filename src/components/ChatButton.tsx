'use client';

import { useState } from 'react';

import { MessageCircle, X } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
};

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Add automated response
    setTimeout(() => {
      const responseMessage: Message = {
        id: Date.now().toString(),
        text: 'Fuck You 🖕',
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000); // Add 1 second delay to make it feel more natural
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700'
        aria-label='Open chat'>
        <MessageCircle className='size-6' />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='fixed bottom-4 right-4 flex h-[600px] w-96 flex-col rounded-lg bg-white shadow-xl dark:bg-zinc-900'>
            {/* Header */}
            <div className='flex items-center justify-between border-b p-4 dark:border-zinc-700'>
              <h2 className='text-lg font-semibold'>ConstructoBot</h2>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                aria-label='Close chat'>
                <X className='size-5' />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className='flex-1 overflow-y-auto p-4'>
              {messages.length === 0 ? (
                <div className='text-center text-gray-500 dark:text-gray-400'>
                  Start a conversation...
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-zinc-800'
                        }`}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className='border-t p-4 dark:border-zinc-700'>
              <form className='flex gap-2' onSubmit={handleSubmit}>
                <input
                  type='text'
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder='Type your message...'
                  className='flex-1 rounded-lg border bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700'
                />
                <button
                  type='submit'
                  className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
