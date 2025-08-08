import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Dice6, Users, Trophy, Ticket, Sparkles, Play, RotateCcw, Download } from 'lucide-react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import GlassCard from '../components/GlassCard';
import { getAllContestants, drawWinners, exportToCSV } from '../utils/raffle';
import { addWinner, getWinners, getWinnersFromSupabase } from '../utils/storage';
import type { DrawType, Contestant } from '../types';

const drawConfigs = [
  {
    id: 'discovery-70' as DrawType,
    name: '70% Discovery',
    description: 'Draw winners from the 70% Discovery pool',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/30',
    textColor: 'text-blue-200'
  },
  {
    id: 'discovery-80' as DrawType,
    name: '80% Discovery', 
    description: 'Draw winners from the 80% Discovery pool',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400/30',
    textColor: 'text-purple-200'
  }
];

export default function Raffle() {
  const [selectedDraw, setSelectedDraw] = useState<DrawType>('discovery-70');
  const [winnerCount, setWinnerCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<Contestant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allWinners, setAllWinners] = useState(getWinners());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadWinnersFromSupabase = async () => {
      setIsLoading(true);
      try {
        const supabaseWinners = await getWinnersFromSupabase();
        setAllWinners(supabaseWinners);
      } catch (error) {
        console.error('Failed to load winners from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWinnersFromSupabase();
  }, []);

  const contestants = getAllContestants(selectedDraw);
  const existingWinnerNames = allWinners.map(w => w.name);
  const availableContestants = contestants.filter(c => !existingWinnerNames.includes(c.name));
  const totalTickets = contestants.reduce((sum, c) => sum + c.tickets, 0);
  const availableTickets = availableContestants.reduce((sum, c) => sum + c.tickets, 0);

  const selectedConfig = drawConfigs.find(config => config.id === selectedDraw)!;

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleDraw = async () => {
    if (availableContestants.length === 0) return;

    setIsDrawing(true);
    setShowResults(false);
    setCurrentWinners([]);

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const winners = drawWinners(availableContestants, Math.min(winnerCount, availableContestants.length), existingWinnerNames);
    
    // Save winners to storage and Supabase
    const savedWinners = winners.map(winner => addWinner(winner, selectedDraw));
    
    setCurrentWinners(winners);
    setAllWinners(prev => [...prev, ...savedWinners]);
    setIsDrawing(false);
    setShowResults(true);

    // Trigger confetti after a short delay
    setTimeout(() => {
      triggerConfetti();
    }, 500);
  };

  const handleReset = () => {
    setCurrentWinners([]);
    setShowResults(false);
  };

  const handleExportCurrentWinners = () => {
    if (currentWinners.length > 0) {
      const winnersWithMetadata = currentWinners.map(winner => ({
        ...winner,
        drawType: selectedDraw,
        drawDate: new Date()
      }));
      exportToCSV(winnersWithMetadata);
    }
  };

  return (
    <Layout title="Raffle System">
      <Navigation />
      
      <div className="space-y-8">
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-white/70">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Loading winners from Supabase...</span>
            </div>
          </div>
        )}

        {/* Draw Type Selection */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Dice6 className="w-8 h-8 mr-3" />
            Select Draw Type
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drawConfigs.map((config) => {
              const configContestants = getAllContestants(config.id);
              const configAvailable = configContestants.filter(c => !existingWinnerNames.includes(c.name));
              const configTotalTickets = configContestants.reduce((sum, c) => sum + c.tickets, 0);
              const configAvailableTickets = configAvailable.reduce((sum, c) => sum + c.tickets, 0);
              
              return (
                <motion.div
                  key={config.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDraw(config.id)}
                  className={`
                    p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2
                    ${selectedDraw === config.id 
                      ? `${config.bgColor} ${config.borderColor} shadow-lg` 
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{config.name}</h3>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${config.color}`}>
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4">{config.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">Contestants</span>
                      </div>
                      <p className="text-white font-bold">{configAvailable.length} / {configContestants.length}</p>
                      <p className="text-white/60 text-xs">Available / Total</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md">
                      <div className="flex items-center space-x-2 mb-1">
                        <Ticket className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">Tickets</span>
                      </div>
                      <p className="text-white font-bold">{configAvailableTickets} / {configTotalTickets}</p>
                      <p className="text-white/60 text-xs">Available / Total</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Draw Configuration */}
        <GlassCard className="p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2" />
            Draw Configuration - {selectedConfig.name}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Number of Winners
              </label>
              <input
                type="number"
                min="1"
                max={Math.min(10, availableContestants.length)}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isDrawing || availableContestants.length === 0}
              />
              <p className="text-white/60 text-xs mt-2">
                Max: {Math.min(10, availableContestants.length)} winners
              </p>
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${selectedConfig.bgColor} backdrop-blur-md border ${selectedConfig.borderColor}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 font-medium">Available Pool</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{availableContestants.length}</p>
                  <p className="text-white/60 text-sm">contestants ready to draw</p>
                </div>
                
                <div className={`p-4 rounded-lg ${selectedConfig.bgColor} backdrop-blur-md border ${selectedConfig.borderColor}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 font-medium">Total Tickets</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{availableTickets}</p>
                  <p className="text-white/60 text-sm">weighted probability pool</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <motion.button
              onClick={handleDraw}
              disabled={isDrawing || availableContestants.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200
                ${availableContestants.length === 0 
                  ? 'bg-gray-500/20 border border-gray-400/30 cursor-not-allowed opacity-50' 
                  : `bg-gradient-to-r ${selectedConfig.color} hover:shadow-lg disabled:opacity-50`
                }
              `}
            >
              {isDrawing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Drawing Winners...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start Draw</span>
                </>
              )}
            </motion.button>

            {showResults && (
              <motion.button
                onClick={handleReset}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 px-6 py-4 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span>New Draw</span>
              </motion.button>
            )}
          </div>

          {availableContestants.length === 0 && (
            <div className="mt-6 p-4 rounded-lg bg-orange-500/20 backdrop-blur-md border border-orange-400/30">
              <p className="text-orange-200 text-center">
                <strong>No contestants available for {selectedConfig.name}</strong>
                <br />
                All contestants from this pool have already been selected as winners.
              </p>
            </div>
          )}
        </GlassCard>

        {/* Drawing Animation */}
        <AnimatePresence>
          {isDrawing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <GlassCard className="p-12 text-center max-w-md mx-4">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Dice6 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Drawing Winners</h3>
                <p className="text-white/80 mb-4">Using weighted probability system...</p>
                <div className="flex justify-center space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResults && currentWinners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                    🎉 Congratulations Winners! 🎉
                  </h3>
                  <motion.button
                    onClick={handleExportCurrentWinners}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 hover:bg-green-500/30 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentWinners.map((winner, index) => (
                    <motion.div
                      key={winner.name}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`p-6 rounded-2xl ${selectedConfig.bgColor} backdrop-blur-md border ${selectedConfig.borderColor} relative overflow-hidden`}
                    >
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-white mb-1">{winner.name}</h4>
                        <p className="text-white/80 text-sm">{winner.department}</p>
                        <p className="text-white/60 text-xs">Supervisor: {winner.supervisor}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Ticket className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{winner.tickets} tickets</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedConfig.bgColor} ${selectedConfig.textColor}`}>
                          {selectedConfig.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-white/10 backdrop-blur-md text-center">
                  <p className="text-white/80">
                    Winners selected using weighted probability based on ticket count.
                    <br />
                    <span className="text-white/60 text-sm">
                      Draw completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </span>
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}