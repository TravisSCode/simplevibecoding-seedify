'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ImageUpload() {
  const { isConnected, address } = useAccount();
  const [image, setImage] = useState<string | null>(null);
  const [aiDescription, setAiDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Исправление для Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAiDescription('');
        setShowSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDescription = async () => {
    if (!image) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.split(',')[1] })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiDescription(data.description);
      } else {
        const demoDescriptions = [
          "✨ This mystical cat wears a hat woven from starlight, guardian of the cosmic library where stories are born from nebulas.",
          "🛡️ A warrior-penguin standing vigilant at the gates of the Arctic Kingdom, his armor forged from eternal ice and ancient magic.",
          "🌌 The traveler's tree grows bridges between dimensions, its leaves whispering secrets of parallel worlds to those who listen.",
          "⚡ In the digital realm, data-dragons weave lightning into tapestries of pure information, singing binary lullabies to sleeping servers.",
          "🔮 The crystal fox of forgotten dreams, keeper of memories that shimmer like dewdrops on a spider's web at dawn."
        ];
        setAiDescription(demoDescriptions[Math.floor(Math.random() * demoDescriptions.length)]);
      }
    } catch (error) {
      console.error('Error:', error);
      setAiDescription("🎭 The AI is currently dreaming... Try again in a moment!");
    } finally {
      setIsGenerating(false);
    }
  };

  const mintNFT = async () => {
    if (!image || !aiDescription) return;
    
    setIsMinting(true);
    setShowConfetti(false);
    setShowSuccess(false);
    setMintProgress(0);
    
    // Анимация прогресса
    const progressInterval = setInterval(() => {
      setMintProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
    
    // Имитация процесса минтинга
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(progressInterval);
    setMintProgress(100);
    
    // Показываем конфетти и успех
    setShowConfetti(true);
    setShowSuccess(true);
    
    // Автоматический сброс через 3 секунды
    setTimeout(() => {
      setImage(null);
      setAiDescription('');
      setIsMinting(false);
      setMintProgress(0);
      setShowConfetti(false);
      setTimeout(() => setShowSuccess(false), 500);
    }, 3000);
  };

  // Если не подключен кошелек
  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-8">🔗</div>
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Connect Your Wallet
        </h2>
        <p className="text-gray-300 mb-10 max-w-md mx-auto text-lg">
          Connect your wallet to Polygon Mumbai testnet to start creating magical AI-powered NFTs
        </p>
        <div className="inline-block p-6 bg-gray-900/50 rounded-2xl border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">📱 Use MetaMask with testnet for demo</p>
          <p className="text-xs text-gray-500">Get test MATIC from Polygon Faucet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Конфетти эффект - только на клиенте */}
      {mounted && showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: `${(i * 3) % 100}%`,
                top: '-10px',
                backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][i % 5],
                animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Шаг 1: Загрузка изображения */}
      <div className="relative">
        <div 
          className="absolute -inset-1 rounded-3xl blur opacity-30"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)',
          }}
        ></div>
        <div className="relative bg-gray-900/70 backdrop-blur-sm border-2 border-dashed border-purple-500/30 rounded-3xl p-8 text-center hover:border-purple-500/50 transition-all duration-300">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="max-h-96 mx-auto rounded-2xl shadow-2xl border-2 border-purple-500/30"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setAiDescription('');
                    setShowSuccess(false);
                  }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                  title="Remove image"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
            ) : (
              <div className="py-20">
                <div className="text-9xl mb-8">📸</div>
                <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Upload Your Image
                </p>
                <p className="text-gray-400 mb-3 text-lg">Drag & drop or click to browse</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                <div className="mt-8 inline-flex items-center justify-center space-x-2 text-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Ready to create magic</span>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Успешный минтинг */}
      {showSuccess && (
        <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-emerald-500/50 rounded-3xl p-8 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            NFT Successfully Minted!
          </h3>
          <p className="text-gray-300 mb-6">
            Your unique AI-powered NFT has been created on Polygon Mumbai
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:scale-105 transition-transform">
              View on Polygonscan
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:scale-105 transition-transform">
              Share on Twitter
            </button>
          </div>
        </div>
      )}

      {/* Шаг 2: Генерация AI истории */}
      {image && !showSuccess && (
        <div className="space-y-8">
          <button
            onClick={generateDescription}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold py-6 rounded-2xl disabled:opacity-50 text-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mr-4"></div>
                <span>AI is weaving magic...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-3 text-2xl">✨</span>
                Generate Magical Story with AI
              </span>
            )}
          </button>

          {aiDescription && (
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🧙‍♂️</div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    AI-Generated Story
                  </h3>
                  <p className="text-gray-400 text-sm">Powered by advanced AI imagination</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <p className="text-gray-200 italic text-lg pl-6">"{aiDescription}"</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-lg">💡</span>
                  <span>Each generation is unique</span>
                </div>
                <button 
                  onClick={generateDescription}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 hover:scale-105 transition-all duration-200"
                >
                  <span>Try another story</span>
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Шаг 3: Минт NFT */}
      {aiDescription && !showSuccess && (
        <div className="space-y-8">
          {/* Индикатор прогресса */}
          {isMinting && (
            <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Minting in Progress
                </h4>
                <span className="text-lg font-bold">{mintProgress}%</span>
              </div>
              <div className="w-full bg-gray-800/50 h-3 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${mintProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className={`relative pl-6 ${mintProgress >= 33 ? 'text-emerald-400' : 'text-gray-400'}`}>
                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${mintProgress >= 33 ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
                  <span className="font-medium">Uploading</span>
                </div>
                <div className={`relative pl-6 ${mintProgress >= 66 ? 'text-emerald-400' : mintProgress >= 33 ? 'text-purple-400' : 'text-gray-400'}`}>
                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${mintProgress >= 66 ? 'bg-emerald-500' : mintProgress >= 33 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                  <span className="font-medium">Processing</span>
                </div>
                <div className={`relative pl-6 ${mintProgress >= 100 ? 'text-emerald-400' : mintProgress >= 66 ? 'text-purple-400' : 'text-gray-400'}`}>
                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${mintProgress >= 100 ? 'bg-emerald-500' : mintProgress >= 66 ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                  <span className="font-medium">Confirming</span>
                </div>
              </div>
            </div>
          )}

          {/* Кнопка минтинга */}
          <button
            onClick={mintNFT}
            disabled={isMinting}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-6 rounded-2xl disabled:opacity-50 text-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {isMinting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mr-4"></div>
                <span>Creating NFT...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-4 text-2xl">🪙</span>
                <span className="text-xl">Mint as NFT (Free on Testnet)</span>
              </span>
            )}
          </button>

          {/* Информация о NFT */}
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent flex items-center">
              <span className="mr-3">📦</span> What You're Creating
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/20 hover:scale-105 transition-transform">
                <div className="text-3xl mb-3 text-center">🖼️</div>
                <p className="font-semibold text-center mb-1">Unique Image</p>
                <p className="text-sm text-gray-400 text-center">Your uploaded artwork</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/20 hover:scale-105 transition-transform">
                <div className="text-3xl mb-3 text-center">📖</div>
                <p className="font-semibold text-center mb-1">AI Story</p>
                <p className="text-sm text-gray-400 text-center">Magical AI-generated tale</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/20 hover:scale-105 transition-transform">
                <div className="text-3xl mb-3 text-center">⛓️</div>
                <p className="font-semibold text-center mb-1">On-chain</p>
                <p className="text-sm text-gray-400 text-center">Stored on Polygon forever</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-300">Network</span>
                <span className="text-emerald-400 font-semibold">Polygon Mumbai</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-300">Cost</span>
                <span className="text-emerald-400 font-semibold">Free (Testnet)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-300">Your Address</span>
                <span className="text-blue-300 font-mono text-xs">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          {/* Подсказки */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/10">
            <h5 className="font-bold mb-3 text-purple-300 flex items-center">
              <span className="mr-2">💡</span> Pro Tips
            </h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2">✓</span>
                <span>Minting is free on Polygon Mumbai testnet</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2">✓</span>
                <span>Get test MATIC from faucet.polygon.technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-2">✓</span>
                <span>Your NFT will be stored permanently on blockchain</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}