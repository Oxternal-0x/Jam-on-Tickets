'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, DollarSign, User, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface Ticket {
  id: string;
  event: string;
  venue: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seat: string;
  price: string;
  currency: string;
  seller: string;
  imageHash: string;
  status: 'available' | 'in_escrow' | 'sold';
  escrowId: string | null;
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyTicket = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with smart contract escrow
      console.log('Initiating escrow for ticket:', ticket.id);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // TODO: Call smart contract function
    } catch (error) {
      console.error('Error buying ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_escrow':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return <Lock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Ticket Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-2">🎫</div>
          <div className="text-sm opacity-90">Ticket Image</div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
          </span>
          <div className="flex items-center text-2xl font-bold text-purple-600">
            <DollarSign className="h-5 w-5 mr-1" />
            {ticket.price}
          </div>
        </div>

        {/* Event Details */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {ticket.event}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{ticket.venue}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(new Date(ticket.date), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{ticket.time}</span>
          </div>
        </div>

        {/* Seat Information */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-600 mb-1">Seat Details</div>
          <div className="text-sm font-medium text-gray-900">
            Section {ticket.section} • Row {ticket.row} • Seat {ticket.seat}
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <User className="h-4 w-4 mr-2" />
          <span>Seller: {ticket.seller}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBuyTicket}
          disabled={isLoading || ticket.status !== 'available'}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            ticket.status === 'available'
              ? 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : ticket.status === 'available' ? (
            'Buy Ticket'
          ) : ticket.status === 'in_escrow' ? (
            'In Escrow'
          ) : (
            'Sold'
          )}
        </button>
      </div>
    </div>
  );
} 