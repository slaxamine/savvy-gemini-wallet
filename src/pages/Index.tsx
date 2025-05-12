
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-wallet-purple to-wallet-dark-purple flex items-center justify-center text-white font-bold">
              SW
            </div>
            <span className="font-bold text-xl">Smart Wallet</span>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/register')}>Sign Up</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20">
          <div className="container flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Manage Your Money with <span className="text-wallet-purple">AI-Powered</span> Insights
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Smart Wallet helps you track expenses, analyze spending patterns, and receive personalized financial advice with Gemini AI integration.
              </p>
              <div className="space-x-4 pt-4">
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Try Demo
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                  Create Account
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="wallet-card rounded-2xl p-6 text-white shadow-lg">
                <div className="text-sm mb-1">Current Balance</div>
                <div className="text-3xl font-bold">5,000.00 MAD</div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Recent Transactions</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-500/20 p-1 rounded-full">
                          <div className="h-6 w-6 flex items-center justify-center">
                            ↓
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>Coffee Shop</div>
                          <div className="text-xs opacity-70">Today</div>
                        </div>
                      </div>
                      <div className="text-red-200">-25.00 MAD</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500/20 p-1 rounded-full">
                          <div className="h-6 w-6 flex items-center justify-center">
                            ↑
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>Salary</div>
                          <div className="text-xs opacity-70">Yesterday</div>
                        </div>
                      </div>
                      <div className="text-green-200">+3,500.00 MAD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-wallet-purple/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wallet-purple"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                <p className="text-muted-foreground">Track your daily expenses and income with detailed categorization and insights.</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-wallet-purple/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wallet-purple"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">Visualize your spending patterns with intuitive charts and graphs for better financial awareness.</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-wallet-purple/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wallet-purple"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">Get personalized financial advice and insights from our Gemini AI-powered assistant.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Wallet App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
