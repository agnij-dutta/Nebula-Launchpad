import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen py-24">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-gradient">Nebula</span>
              <span className="text-white"> DeSci AI</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Decentralized Scientific Research Powered by Artificial Intelligence
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/agents" className="gradient-button py-3 px-8">
                Launch App
              </Link>
              <Link href="/token" className="gradient-button py-3 px-8 bg-opacity-50">
                View Agents
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-panel card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary-purple/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Research Agents</h3>
                <p className="text-text-secondary">
                  Access specialized AI agents trained for scientific research and analysis
                </p>
              </div>

              <div className="glass-panel card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary-purple/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Token Economy</h3>
                <p className="text-text-secondary">
                  Earn and stake DSCI tokens to participate in the ecosystem
                </p>
              </div>

              <div className="glass-panel card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary-purple/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Community Governance</h3>
                <p className="text-text-secondary">
                  Participate in platform decisions and protocol upgrades
                </p>
              </div>

              <div className="glass-panel card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary-purple/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Decentralized</h3>
                <p className="text-text-secondary">
                  Built on blockchain for transparency and security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
