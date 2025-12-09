'use client';

import { useState, useEffect } from 'react';

interface NFTItem {
  id: number;
  image: string;
  description: string;
  creator: string;
  timestamp: string;
  likes: number;
}

export default function Gallery() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Демо-данные для галереи
    const demoNFTs: NFTItem[] = [
      {
        id: 1,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MagicCat&backgroundColor=8b5cf6',
        description: 'A mystical guardian watching over the digital forest, its eyes reflecting ancient code.',
        creator: '0x1234...5678',
        timestamp: '2 hours ago',
        likes: 42
      },
      {
        id: 2,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Wizard&backgroundColor=ec4899',
        description: 'The wizard of code, conjuring algorithms from the ether with a wave of his digital staff.',
        creator: '0xabcd...efgh',
        timestamp: '1 day ago',
        likes: 87
      },
      {
        id: 3,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Robot&backgroundColor=0ea5e9',
        description: 'Ancient robot dreaming of electric poetry, its circuits humming forgotten melodies.',
        creator: '0x7890...1234',
        timestamp: '3 days ago',
        likes: 156
      },
      {
        id: 4,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dragon&backgroundColor=f97316',
        description: 'Data-dragon weaving lightning into tapestries of pure information across the cloud skies.',
        creator: '0x5678...9012',
        timestamp: '1 week ago',
        likes: 231
      },
      {
        id: 5,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alien&backgroundColor=10b981',
        description: 'Stellar traveler documenting Earths digital awakening in its crystalline memory banks.',
        creator: '0x3456...7890',
        timestamp: '2 weeks ago',
        likes: 189
      },
      {
        id: 6,
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phoenix&backgroundColor=8b5cf6',
        description: 'Digital phoenix reborn from deprecated code, its feathers shimmering with new frameworks.',
        creator: '0x9012...3456',
        timestamp: '3 weeks ago',
        likes: 312
      }
    ];

    // Имитация загрузки
    setTimeout(() => {
      setNfts(demoNFTs);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading magical creations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Community Gallery</h2>
          <p className="text-gray-400">Explore AI-generated NFT stories from creators worldwide</p>
        </div>
        <div className="bg-purple-900/30 text-purple-300 px-4 py-2 rounded-full border border-purple-700/50">
          {nfts.length} Magical Creations
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div 
            key={nft.id} 
            className="bg-gradient-to-b from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="p-5">
              <div className="relative">
                <img 
                  src={nft.image} 
                  alt={`NFT ${nft.id}`}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  #{nft.id}
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-3 italic">
                "{nft.description}"
              </p>
              
              <div className="flex justify-between items-center text-sm mb-4">
                <div>
                  <p className="text-gray-500 text-xs">Creator</p>
                  <p className="font-mono text-xs">{nft.creator}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Created</p>
                  <p>{nft.timestamp}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button className="flex items-center space-x-2 hover:text-pink-400 transition-colors group">
                  <span className="group-hover:scale-110 transition-transform">❤️</span>
                  <span>{nft.likes}</span>
                </button>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs transition-colors">
                    Collect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
