'use client';

import { useState, useRef } from 'react';
import { X, Upload, Calendar, MapPin, Clock, DollarSign, User, Hash } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface TicketModalProps {
  onClose: () => void;
  onSubmit: (ticket: any) => void;
}

export default function TicketModal({ onClose, onSubmit }: TicketModalProps) {
  const { address } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    event: '',
    venue: '',
    date: '',
    time: '',
    section: '',
    row: '',
    seat: '',
    price: '',
    currency: 'USD',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedHash, setUploadedHash] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // TODO: Upload to IPFS and get hash
      setUploadedHash('QmHash' + Math.random().toString(36).substr(2, 9));
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    // TODO: Implement actual IPFS upload
    // For now, return a mock hash
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('QmHash' + Math.random().toString(36).substr(2, 9));
      }, 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a ticket image');
      return;
    }

    setIsLoading(true);
    try {
      // Upload file to IPFS
      const hash = await uploadToIPFS(selectedFile);
      
      const newTicket = {
        id: Date.now().toString(),
        ...formData,
        seller: address,
        imageHash: hash,
        status: 'available' as const,
        escrowId: null,
      };

      // TODO: Call smart contract to list ticket
      console.log('Listing ticket on smart contract:', newTicket);
      
      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(newTicket);
      toast.success('Ticket listed successfully!');
    } catch (error) {
      console.error('Error listing ticket:', error);
      toast.error('Failed to list ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">List Ticket for Sale</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
            >
              {selectedFile ? (
                <div>
                  <div className="text-green-600 mb-2">✓ File selected</div>
                  <div className="text-sm text-gray-600">{selectedFile.name}</div>
                  {uploadedHash && (
                    <div className="text-xs text-gray-500 mt-2">
                      <Hash className="h-3 w-3 inline mr-1" />
                      {uploadedHash}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">
                    Click to upload ticket image
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Event Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Taylor Swift - The Eras Tour"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., SoFi Stadium, Los Angeles"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Seat Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Floor A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Row
              </label>
              <input
                type="text"
                name="row"
                value={formData.row}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seat
              </label>
              <input
                type="text"
                name="seat"
                value={formData.seat}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 23"
              />
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Listing Ticket...
              </div>
            ) : (
              'List Ticket'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 