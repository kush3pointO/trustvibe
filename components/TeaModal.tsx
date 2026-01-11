"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '@/ui/components/IconButton';
import { Button } from '@/ui/components/Button';
import { TextFieldUnstyled } from '@/ui/components/TextFieldUnstyled';
import { FeatherX, FeatherSend, FeatherCoffee, FeatherUserPlus } from '@/subframe/core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolsUsed?: string[]; // Track which tools were used
}

interface TeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function TeaModal({ isOpen, onClose, initialQuery }: TeaModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [queriesRemaining, setQueriesRemaining] = useState(2);
  const [showSignupBanner, setShowSignupBanner] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentToolsUsed, setCurrentToolsUsed] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create session ID
    let sid = localStorage.getItem('tea_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('tea_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentToolsUsed([]);

    try {
      const response = await fetch('/api/tea/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          sessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'QUERY_LIMIT_REACHED') {
          setShowSignupBanner(true);
          setQueriesRemaining(0);
          return;
        }
        throw new Error(error.message || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const toolsUsed: string[] = [];

      setMessages(prev => [...prev, { role: 'assistant', content: '', toolsUsed: [] }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'tool_use') {
              // Track tool usage
              console.log('🔧 Tool used:', data.tool);
              toolsUsed.push(data.tool);
              setCurrentToolsUsed(prev => [...prev, data.tool]);
            }

            if (data.type === 'chunk') {
              assistantMessage += data.content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage,
                  toolsUsed: toolsUsed,
                };
                return newMessages;
              });
            } else if (data.type === 'done') {
              setQueriesRemaining(data.queriesRemaining);
              if (data.queriesRemaining === 0) {
                setShowSignupBanner(true);
              }
              // Log final tools used
              console.log('✅ Request complete. Tools used:', data.toolsUsed || toolsUsed);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-brand-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <FeatherCoffee className="text-brand-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-heading-3 font-heading-3 text-default-font">
                Tea
              </h2>
              <p className="text-caption text-subtext-color">
                Your TrustVibe Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!showSignupBanner && (
              <span className="text-caption-bold font-caption-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">
                {queriesRemaining} {queriesRemaining === 1 ? 'query' : 'queries'} remaining
              </span>
            )}
            <IconButton
              variant="neutral"
              size="medium"
              icon={<FeatherX />}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                <FeatherCoffee className="text-brand-600 w-10 h-10" />
              </div>
              <h3 className="text-heading-3 font-heading-3 text-default-font mb-2">
                Hi! I'm Tea ☕
              </h3>
              <p className="text-body text-subtext-color max-w-md">
                Ask me about any professional, service, or place. I'll search through
                authentic TrustVibe community experiences to help you make informed decisions.
              </p>
              <div className="mt-6 space-y-2 w-full max-w-md">
                <p className="text-caption-bold font-caption-bold text-neutral-700">
                  Try asking:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setInput('Tell me about therapists in Mumbai')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-body text-default-font transition-colors"
                  >
                    "Tell me about therapists in Mumbai"
                  </button>
                  <button
                    onClick={() => setInput('What should I know about Dr. Priya Sharma?')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-body text-default-font transition-colors"
                  >
                    "What should I know about Dr. Priya Sharma?"
                  </button>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 text-default-font'
                  }`}
                >
                  <p className="text-body whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
              
              {/* Show tools used badge for assistant messages */}
              {message.role === 'assistant' && message.toolsUsed && message.toolsUsed.length > 0 && (
                <div className="flex justify-start mt-2">
                  <div className="flex gap-2 flex-wrap max-w-[80%]">
                    {message.toolsUsed.includes('search_trustvibe_reviews') && (
                      <span className="text-caption px-2 py-1 bg-brand-100 text-brand-700 rounded-full">
                        📚 TrustVibe DB
                      </span>
                    )}
                    {message.toolsUsed.includes('search_web') && (
                      <span className="text-caption px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        🌐 Web Search
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-caption text-subtext-color">
                      Tea is brewing your answer...
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Show current tools being used */}
              {currentToolsUsed.length > 0 && (
                <div className="flex justify-start mt-2">
                  <div className="flex gap-2 flex-wrap max-w-[80%]">
                    {currentToolsUsed.includes('search_trustvibe_reviews') && (
                      <span className="text-caption px-2 py-1 bg-brand-100 text-brand-700 rounded-full animate-pulse">
                        📚 Searching TrustVibe...
                      </span>
                    )}
                    {currentToolsUsed.includes('search_web') && (
                      <span className="text-caption px-2 py-1 bg-green-100 text-green-700 rounded-full animate-pulse">
                        🌐 Searching Web...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Signup Banner */}
        {showSignupBanner && (
          <div className="px-6 py-4 bg-gradient-to-r from-brand-100 to-brand-50 border-t border-brand-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-bold font-body-bold text-brand-900">
                  🎉 You've used your 2 free queries!
                </p>
                <p className="text-body text-brand-800">
                  Sign up for unlimited access to Tea and all TrustVibe features
                </p>
              </div>
              <Button
                variant="brand-primary"
                size="medium"
                icon={<FeatherUserPlus />}
                onClick={() => {
                  // TODO: Open signup modal
                  alert('Signup feature coming in Phase 1.5!');
                }}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        {!showSignupBanner && (
          <div className="px-6 py-4 border-t border-neutral-200 bg-white">
            <div 
              className="flex items-center gap-2 bg-neutral-50 rounded-full px-4 py-2 border border-neutral-200 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all"
              onKeyDown={handleKeyDown}
            >
              <TextFieldUnstyled className="flex-1">
                <TextFieldUnstyled.Input
                  placeholder="Ask Tea anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
              </TextFieldUnstyled>
              <IconButton
                variant="brand-primary"
                size="medium"
                icon={<FeatherSend />}
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              />
            </div>
            <p className="text-caption text-subtext-color mt-2 text-center">
              Press Enter to send • Tea searches authentic TrustVibe reviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
