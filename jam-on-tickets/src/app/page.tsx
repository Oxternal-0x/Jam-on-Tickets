'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useMemo, useCallback } from 'react';
import { Ticket, Search, Filter, Plus, User, Home as HomeIcon, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import TicketCard from '@/components/TicketCard';
import FilterModal from '@/components/FilterModal';

// Lazy load modals to reduce initial bundle size
const TicketModal = dynamic(() => import('@/components/TicketModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});

// Types
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

interface Filters {
  minPrice: string;
  maxPrice: string;
  event: string;
  venue: string;
  date: string;
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
  {
    id: '1',
    event: 'Taylor Swift - The Eras Tour',
    venue: 'SoFi Stadium, Los Angeles',
    date: '2024-08-15',
    time: '20:00',
    section: 'Floor A',
    row: '15',
    seat: '23',
    price: '450',
    currency: 'USD',
    seller: '0x1234...5678',
    imageHash: 'QmHash123',
    status: 'available',
    escrowId: null,
  },
  {
    id: '2',
    event: 'Ed Sheeran - Mathematics Tour',
    venue: 'MetLife Stadium, New Jersey',
    date: '2024-09-20',
    time: '19:30',
    section: '100',
    row: '8',
    seat: '12',
    price: '180',
    currency: 'USD',
    seller: '0x8765...4321',
    imageHash: 'QmHash456',
    status: 'available',
    escrowId: null,
  },
  {
    id: '3',
    event: 'Beyoncé - Renaissance World Tour',
    venue: 'Mercedes-Benz Stadium, Atlanta',
    date: '2024-10-05',
    time: '20:30',
    section: '200',
    row: '5',
    seat: '7',
    price: '320',
    currency: 'USD',
    seller: '0x9876...5432',
    imageHash: 'QmHash789',
    status: 'in_escrow',
    escrowId: 'escrow_123',
  },
];

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    minPrice: '',
    maxPrice: '',
    event: '',
    venue: '',
    date: '',
  });

  // Memoized filtering logic for better performance
  const filteredTickets = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
    
    return tickets.filter(ticket => {
      const matchesSearch = ticket.event.toLowerCase().includes(searchLower) ||
                           ticket.venue.toLowerCase().includes(searchLower);
      const matchesPrice = parseFloat(ticket.price) >= minPrice && parseFloat(ticket.price) <= maxPrice;
      const matchesEvent = !filters.event || ticket.event.toLowerCase().includes(filters.event.toLowerCase());
      const matchesVenue = !filters.venue || ticket.venue.toLowerCase().includes(filters.venue.toLowerCase());
      const matchesDate = !filters.date || ticket.date === filters.date;

      return matchesSearch && matchesPrice && matchesEvent && matchesVenue && matchesDate;
    });
  }, [tickets, searchTerm, filters]);

  const handleAddTicket = useCallback((newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    setShowTicketModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Ticket className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Jam-on-Tickets</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events, venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => setShowTicketModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Sell Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-purple-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Search className="h-6 w-6" />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Plus className="h-6 w-6" />
            <span className="text-xs">Sell</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">Chat</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showTicketModal && (
        <TicketModal
          onClose={() => setShowTicketModal(false)}
          onSubmit={handleAddTicket}
        />
      )}
      
      {showFilterModal && (
        <FilterModal
          filters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilterModal(false);
          }}
        />
      )}
    </div>
  );
}
