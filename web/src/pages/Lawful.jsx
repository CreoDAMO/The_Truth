
import React from 'react';

const Lawful = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ⚖️ Legal Framework
        </h1>
        <p className="text-xl text-gray-300">Compliance and lawful positioning</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">📜 Documentation</h3>
          <div className="space-y-3">
            <a href="/LAW/BLACKPAPER.md" className="block bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/10 transition-all">
              📄 Blackpaper - Legal Foundation
            </a>
            <a href="/LAW/TRUST_DEED_PROVENANCE.md" className="block bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/10 transition-all">
              🛡️ Trust Deed & Provenance
            </a>
            <a href="/LAW/TOKEN_TERMS_TRUTH.md" className="block bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/10 transition-all">
              💎 TRUTH Token Terms
            </a>
            <a href="/LAW/TREASURY_RESOLUTION.md" className="block bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-white/10 transition-all">
              🏦 Treasury Resolution
            </a>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-green-400">✅ Compliance Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Treasury Status:</span>
              <span className="text-green-400 font-bold">✅ Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Trust Status:</span>
              <span className="text-green-400 font-bold">✅ Irrevocable</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tax Compliance:</span>
              <span className="text-green-400 font-bold">✅ Current</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Audit Status:</span>
              <span className="text-yellow-400 font-bold">📋 Scheduled Q4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lawful;
