'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import ImageUpload from '@/components/ImageUpload';
import Gallery from '@/components/Gallery';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ✨ AI NFT Storyteller
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Turn images into magical NFT stories with AI • Built with Vibe Coding
            </p>
          </div>
          <ConnectButton 
            showBalance={false}
            accountStatus="full"
            chainStatus="icon"
          />
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-900/70 rounded-2xl p-2 border border-gray-700">
            <button
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all ${activeTab === 'create' ? 'bg-gradient-to-r from-purple-700 to-pink-700 shadow-lg' : 'hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('create')}
            >
              🎨 Create NFT
            </button>
            <button
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all ${activeTab === 'gallery' ? 'bg-gradient-to-r from-purple-700 to-pink-700 shadow-lg' : 'hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab('gallery')}
            >
              🖼️ Community Gallery
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'create' ? <ImageUpload /> : <Gallery />}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p className="mb-2">
            Built for <span className="text-purple-400 font-semibold">Seedify Vibe Coins</span> using Vibe Coding
          </p>
          <p className="text-sm">
            AI-powered NFT minting on Polygon • All prompts documented in <code>/vibe-coding-log</code>
          </p>
        </footer>
      </div>
    </main>
  );
}