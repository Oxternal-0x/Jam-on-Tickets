'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import { useAccount } from 'wagmi';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isFromMe: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  sellerAddress: string;
  buyerAddress?: string;
}

export default function ChatModal({ 
  isOpen, 
  onClose, 
  ticketId, 
  sellerAddress, 
  buyerAddress 
}: ChatModalProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demo
  useEffect(() => {
    if (isOpen) {
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: sellerAddress,
          content: 'Hi! I have the ticket available. Are you still interested?',
          timestamp: new Date(Date.now() - 3600000),
          isFromMe: false,
        },
        {
          id: '2',
          sender: address || '',
          content: 'Yes, I am! Can you confirm the seat details?',
          timestamp: new Date(Date.now() - 1800000),
          isFromMe: true,
        },
        {
          id: '3',
          sender: sellerAddress,
          content: 'Section Floor A, Row 15, Seat 23. Perfect view!',
          timestamp: new Date(Date.now() - 900000),
          isFromMe: false,
        },
      ];
      setMessages(mockMessages);
    }
  }, [isOpen, sellerAddress, address]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !address) return;

    setIsLoading(true);
    
    try {
      const message: Message = {
        id: Date.now().toString(),
        sender: address,
        content: newMessage.trim(),
        timestamp: new Date(),
        isFromMe: true,
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // TODO: Send message to smart contract or web3 messaging service
      console.log('Sending message:', message);
      
      // Simulate message delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ticket Chat</h3>
              <p className="text-sm text-gray-500">Ticket #{ticketId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close chat"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isFromMe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isFromMe ? 'text-purple-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 