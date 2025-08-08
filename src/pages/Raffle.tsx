import React from 'react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';

export default function Raffle() {
  return (
    <Layout>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Raffle</h1>
        <div className="text-white">
          <p>Raffle functionality coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}