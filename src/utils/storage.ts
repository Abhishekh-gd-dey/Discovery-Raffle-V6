import type { Winner, DrawType } from '../types';
import { supabase } from '../lib/supabase';

const WINNERS_70_KEY = 'contest_winners_70';
const WINNERS_80_KEY = 'contest_winners_80';

const getStorageKey = (drawType: DrawType): string => {
  return drawType === 'discovery-70' ? WINNERS_70_KEY : WINNERS_80_KEY;
};

export const getWinners = (drawType?: DrawType): Winner[] => {
  // For now, keep using localStorage but we'll migrate to Supabase
  if (!drawType) {
    // Return all winners from both draws
    const winners70 = getWinners('discovery-70');
    const winners80 = getWinners('discovery-80');
    return [...winners70, ...winners80].sort((a, b) => 
      new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
    );
  }

  const stored = localStorage.getItem(getStorageKey(drawType));
  if (!stored) return [];
  
  try {
    const winners = JSON.parse(stored);
    return winners.map((winner: any) => ({
      ...winner,
      drawDate: new Date(winner.drawDate)
    }));
  } catch {
    return [];
  }
};

export const getWinnersFromSupabase = async (drawType?: DrawType): Promise<Winner[]> => {
  try {
    let query = supabase
      .from('winners')
      .select('*')
      .order('draw_date', { ascending: false });

    if (drawType) {
      query = query.eq('draw_type', drawType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching winners from Supabase:', error);
      // Fallback to localStorage
      return getWinners(drawType);
    }

    return data.map(winner => ({
      id: winner.id,
      name: winner.name,
      department: winner.department as any,
      supervisor: winner.supervisor,
      tickets: winner.tickets,
      drawType: winner.draw_type,
      drawDate: new Date(winner.draw_date)
    }));
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    // Fallback to localStorage
    return getWinners(drawType);
  }
};

export const saveWinners = (winners: Winner[], drawType: DrawType): void => {
  localStorage.setItem(getStorageKey(drawType), JSON.stringify(winners));
};

export const saveWinnerToSupabase = async (winner: Winner): Promise<void> => {
  try {
    const { error } = await supabase
      .from('winners')
      .insert({
        id: winner.id,
        name: winner.name,
        department: winner.department,
        supervisor: winner.supervisor,
        tickets: winner.tickets,
        draw_type: winner.drawType,
        draw_date: winner.drawDate.toISOString()
      });

    if (error) {
      console.error('Error saving winner to Supabase:', error);
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
};

export const addWinner = (winner: Omit<Winner, 'id' | 'drawDate'>, drawType: DrawType): Winner => {
  const winners = getWinners(drawType);
  const newWinner: Winner = {
    ...winner,
    id: Date.now().toString(),
    drawDate: new Date(),
    drawType
  };
  
  winners.push(newWinner);
  saveWinners(winners, drawType);
  
  // Also save to Supabase
  saveWinnerToSupabase(newWinner);
  
  return newWinner;
};

export const clearWinners = (drawType?: DrawType): void => {
  if (!drawType) {
    // Clear both draws
    localStorage.removeItem(WINNERS_70_KEY);
    localStorage.removeItem(WINNERS_80_KEY);
  } else {
    localStorage.removeItem(getStorageKey(drawType));
  }
};

export const clearWinnersFromSupabase = async (drawType?: DrawType): Promise<void> => {
  try {
    let query = supabase.from('winners').delete();
    
    if (drawType) {
      query = query.eq('draw_type', drawType);
    } else {
      query = query.neq('id', ''); // Delete all
    }

    const { error } = await query;

    if (error) {
      console.error('Error clearing winners from Supabase:', error);
    }
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
};