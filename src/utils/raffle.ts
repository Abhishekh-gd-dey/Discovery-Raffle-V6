import type { Contestant, Department, DrawType } from '../types';
import contestants70Data from '../data/contestants-70.json';
import contestants80Data from '../data/contestants-80.json';

export const getAllContestants = (drawType: DrawType): Contestant[] => {
  const data = drawType === 'discovery-70' ? contestants70Data : contestants80Data;
  return data as Contestant[];
};

export const getContestantsByDepartment = (department: Department, drawType: DrawType): Contestant[] => {
  return getAllContestants(drawType).filter(c => c.department === department);
};

export const drawWinnersWeighted = (
  pool: Contestant[], 
  count: number, 
  excludeWinners: string[] = []
): Contestant[] => {
  const availablePool = pool.filter(c => !excludeWinners.includes(c.name));
  
  if (availablePool.length < count) {
    return availablePool;
  }

  const winners: Contestant[] = [];
  let remainingPool = [...availablePool];

  for (let i = 0; i < count; i++) {
    if (remainingPool.length === 0) break;

    // Calculate total tickets in remaining pool
    const totalTickets = remainingPool.reduce((sum, contestant) => sum + contestant.tickets, 0);
    
    // Generate random number between 1 and totalTickets
    const randomTicket = Math.floor(Math.random() * totalTickets) + 1;
    
    // Find winner based on weighted probability
    let currentSum = 0;
    let selectedWinner: Contestant | null = null;
    
    for (const contestant of remainingPool) {
      currentSum += contestant.tickets;
      if (randomTicket <= currentSum) {
        selectedWinner = contestant;
        break;
      }
    }
    
    if (selectedWinner) {
      winners.push(selectedWinner);
      // Remove winner from remaining pool
      remainingPool = remainingPool.filter(c => c.name !== selectedWinner!.name);
    }
  }

  return winners;
};
export const drawWinners = (
  pool: Contestant[], 
  count: number, 
  excludeWinners: string[] = []
): Contestant[] => {
  // Use weighted draw by default
  return drawWinnersWeighted(pool, count, excludeWinners);
};

export const drawWinnersUnweighted = (
  pool: Contestant[], 
  count: number, 
  excludeWinners: string[] = []
): Contestant[] => {
  const availablePool = pool.filter(c => !excludeWinners.includes(c.name));
  
  if (availablePool.length < count) {
    return availablePool;
  }

  const winners: Contestant[] = [];
  const shuffled = [...availablePool];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * shuffled.length);
    winners.push(shuffled.splice(randomIndex, 1)[0]);
  }

  return winners;
};

export const exportToCSV = (winners: any[]): void => {
  const headers = ['Name', 'Department', 'Supervisor', 'Tickets', 'Draw Type', 'Draw Date'];
  const csvContent = [
    headers.join(','),
    ...winners.map(winner => [
      winner.name,
      winner.department,
      winner.supervisor,
      winner.tickets,
      winner.drawType === 'discovery-70' ? '70% Discovery' : '80% Discovery',
      new Date(winner.drawDate).toLocaleDateString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contest-winners-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};