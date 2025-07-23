'use client';

import { useState } from 'react';
import { X, Filter } from 'lucide-react';

interface Filters {
  minPrice: string;
  maxPrice: string;
  event: string;
  venue: string;
  date: string;
}

interface FilterModalProps {
  filters: Filters;
  onClose: () => void;
  onApply: (filters: Filters) => void;
}

export default function FilterModal({ filters, onClose, onApply }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      event: '',
      venue: '',
      date: '',
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filter Tickets</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close filter modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Form */}
        <div className="p-6 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minPrice" className="sr-only">Minimum Price</label>
                <input
                  id="minPrice"
                  type="number"
                  name="minPrice"
                  value={localFilters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
                <input
                  id="maxPrice"
                  type="number"
                  name="maxPrice"
                  value={localFilters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Event */}
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
              Event
            </label>
            <input
              id="event"
              type="text"
              name="event"
              value={localFilters.event}
              onChange={handleInputChange}
              placeholder="Search by event name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              id="venue"
              type="text"
              name="venue"
              value={localFilters.venue}
              onChange={handleInputChange}
              placeholder="Search by venue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={localFilters.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 