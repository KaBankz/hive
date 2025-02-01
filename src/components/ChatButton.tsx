'use client';

import { useEffect, useRef, useState } from 'react';

import { Brain, MessageCircle, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { usePdf } from '@/context/PdfContext';
import { cn } from '@/lib/utils';

// AI response cleanup
// it responds with soo much html 😭
function stripHtmlAndFormatMarkdown(html: string): string {
  const withoutTags = html
    .replace(/<div[^>]*>|<\/div>/g, '\n')
    .replace(/<ul[^>]*>|<\/ul>/g, '\n')
    .replace(/<li[^>]*>\s*•\s*|<li[^>]*>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/class="[^"]*"/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  const cleanText = withoutTags
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n\s*\n/g, '\n\n');

  return cleanText.replace(/###\s*([^\n]+)/g, '### $1\n');
}

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
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { pdfBlob } = usePdf();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Auto-resize textarea as content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputMessage]);

  // magical effect ✨
  useEffect(() => {
    const sendInitialAnalysis = async () => {
      if (isOpen && messages.length === 0 && pdfBlob) {
        setIsLoading(true);
        try {
          const formData = new FormData();
          // formData.append('question', '');
          formData.append('file', pdfBlob, 'current-document.pdf');

          const response = await fetch('/api/v1/hivemind/ask', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          const cleanResponse = stripHtmlAndFormatMarkdown(data.answer);

          const responseMessage: Message = {
            id: Date.now().toString(),
            text: cleanResponse,
            sender: 'system',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, responseMessage]);
        } catch (error) {
          console.error('Error sending initial analysis:', error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: 'Sorry, there was an error analyzing the document.',
            sender: 'system',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    sendInitialAnalysis();
  }, [isOpen, messages.length, pdfBlob]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', inputMessage.trim());

      if (pdfBlob) {
        formData.append('file', pdfBlob, 'current-document.pdf');
      }

      const response = await fetch('/api/v1/hivemind/ask', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const cleanResponse = stripHtmlAndFormatMarkdown(data.answer);

      const responseMessage: Message = {
        id: Date.now().toString(),
        text: cleanResponse,
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your message.',
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25'
        aria-label='Open chat'>
        <MessageCircle className='size-6' />
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center'>
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity'
            onClick={() => setIsOpen(false)}
          />
          <div className='relative flex h-[80vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-zinc-900'>
            <div className='flex items-center justify-between border-b bg-white/50 p-4 pb-2 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50'>
              <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                HiveMind
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className='rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-200'
                aria-label='Close chat'>
                <X className='size-5' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto bg-gray-50/50 p-4 dark:bg-zinc-900/50'>
              {messages.length === 0 ? (
                <div className='flex h-full flex-col items-center justify-center space-y-4 text-center'>
                  {isLoading ? (
                    <div className='flex flex-col items-center space-y-6'>
                      <div className='relative flex size-20 items-center justify-center'>
                        <div className='absolute inset-0 animate-ping-slow opacity-20'>
                          <div className='size-full rounded-full bg-blue-500/50' />
                        </div>
                        <div className='absolute size-full animate-spin-slow'>
                          <div className='absolute inset-1 rounded-full border-2 border-blue-500/30' />
                        </div>
                        <div className='absolute size-full animate-spin-reverse-slower'>
                          <div className='absolute inset-2 rounded-full border-2 border-dashed border-blue-500/20' />
                        </div>
                        <Brain className='relative size-8 animate-pulse text-blue-500' />
                        <div className='absolute -right-1 -top-1 animate-bounce'>
                          <Sparkles className='size-5 text-blue-400' />
                        </div>
                        <div className='absolute -bottom-2 -left-1 animate-bounce delay-100'>
                          <Sparkles className='size-4 text-blue-400' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                          Analyzing Report
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Processing with AI magic ✨
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='rounded-full bg-blue-100 p-4 dark:bg-blue-900/25'>
                        <MessageCircle className='size-8 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                          Welcome to HiveMind
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          Ask questions about your daily report
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      )}>
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm',
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                            : 'bg-white dark:bg-zinc-800'
                        )}>
                        {message.sender === 'system' ? (
                          <div className='prose prose-sm max-w-none dark:prose-invert'>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className='flex justify-start'>
                      <div className='flex max-w-[85%] items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm dark:bg-zinc-800'>
                        <div className='size-2.5 animate-bounce rounded-full bg-blue-500 opacity-75 [animation-delay:-0.3s]'></div>
                        <div className='size-2.5 animate-bounce rounded-full bg-blue-500 opacity-75 [animation-delay:-0.15s]'></div>
                        <div className='size-2.5 animate-bounce rounded-full bg-blue-500 opacity-75'></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className='border-t bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'>
              <form className='flex gap-2' onSubmit={handleSubmit}>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder='Type your message...'
                  className='flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10'
                  style={{ minHeight: '42px', maxHeight: '160px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type='submit'
                  className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50'>
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
