'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Lock, Unlock } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface EscrowStatusProps {
  escrowId: string;
  ticketId: string;
  buyer: string;
  seller: string;
  amount: string;
  status: 'pending' | 'funded' | 'released' | 'cancelled';
  onStatusChange: (newStatus: string) => void;
}

export default function EscrowStatus({
  escrowId,
  ticketId,
  buyer,
  seller,
  amount,
  status,
  onStatusChange
}: EscrowStatusProps) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(3600); // 1 hour in seconds

  const isSeller = address?.toLowerCase() === seller.toLowerCase();
  const isBuyer = address?.toLowerCase() === buyer.toLowerCase();

  useEffect(() => {
    if (status === 'funded') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReleaseTicket = async () => {
    if (!isSeller) return;
    
    setIsLoading(true);
    try {
      // TODO: Call smart contract to release ticket
      console.log('Releasing ticket from escrow:', escrowId);
      
      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onStatusChange('released');
      toast.success('Ticket released successfully!');
    } catch (error) {
      console.error('Error releasing ticket:', error);
      toast.error('Failed to release ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEscrow = async () => {
    if (!isBuyer) return;
    
    setIsLoading(true);
    try {
      // TODO: Call smart contract to cancel escrow
      console.log('Cancelling escrow:', escrowId);
      
      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onStatusChange('cancelled');
      toast.success('Escrow cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling escrow:', error);
      toast.error('Failed to cancel escrow');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'funded':
        return <Lock className="h-5 w-5 text-blue-500" />;
      case 'released':
        return <Unlock className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'funded':
        return 'Funds Locked';
      case 'released':
        return 'Ticket Released';
      case 'cancelled':
        return 'Escrow Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">Escrow Status</h3>
            <p className="text-sm text-gray-500">ID: {escrowId}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Ticket ID:</span>
          <p className="font-medium">{ticketId}</p>
        </div>
        <div>
          <span className="text-gray-500">Amount:</span>
          <p className="font-medium">${amount}</p>
        </div>
        <div>
          <span className="text-gray-500">Buyer:</span>
          <p className="font-medium font-mono text-xs">{buyer}</p>
        </div>
        <div>
          <span className="text-gray-500">Seller:</span>
          <p className="font-medium font-mono text-xs">{seller}</p>
        </div>
      </div>

      {/* Timer for funded escrow */}
      {status === 'funded' && timeRemaining > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700">Time remaining to release:</span>
            </div>
            <span className="font-mono text-lg font-bold text-blue-700">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      {status === 'funded' && (
        <div className="flex space-x-3">
          {isSeller && (
            <button
              onClick={handleReleaseTicket}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Releasing...
                </div>
              ) : (
                'Release Ticket'
              )}
            </button>
          )}
          
          {isBuyer && (
            <button
              onClick={handleCancelEscrow}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelling...
                </div>
              ) : (
                'Cancel Escrow'
              )}
            </button>
          )}
        </div>
      )}

      {/* Status Messages */}
      {status === 'released' && (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">Ticket has been released to the buyer!</span>
          </div>
        </div>
      )}

      {status === 'cancelled' && (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">Escrow has been cancelled. Funds returned to buyer.</span>
          </div>
        </div>
      )}
    </div>
  );
} 