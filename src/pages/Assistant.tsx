
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Smart Wallet AI Assistant. How can I help you with your finances today? You can ask me questions like 'How much did I spend this week?' or 'What's my biggest expense category?'",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { balance, transactions, categories } = useWallet();
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // For the demo, simulate AI responses
    setTimeout(() => {
      let response = "";
      const query = input.toLowerCase();
      
      // Simple response logic based on user query
      if (query.includes('help')) {
        response = "I can help you analyze your spending, track your budget, and give you insights about your financial habits. Try asking specific questions about your transactions or budget!";
      }
      else if (query.includes('balance') || query.includes('how much')) {
        response = `Your current balance is ${balance.toFixed(2)} MAD.`;
      }
      else if (query.includes('spent') && query.includes('week')) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyExpenses = transactions
          .filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo)
          .reduce((sum, t) => sum + t.amount, 0);
        
        response = `You've spent ${weeklyExpenses.toFixed(2)} MAD in the last 7 days.`;
      }
      else if (query.includes('spent') && query.includes('month')) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const monthlyExpenses = transactions
          .filter(t => t.type === 'expense' && new Date(t.date) >= oneMonthAgo)
          .reduce((sum, t) => sum + t.amount, 0);
        
        response = `You've spent ${monthlyExpenses.toFixed(2)} MAD in the last 30 days.`;
      }
      else if (query.includes('biggest expense') || query.includes('most spent')) {
        // Get expenses by category
        const expensesByCategory = categories.map(category => {
          const amount = transactions
            .filter(t => t.type === 'expense' && t.category === category.id)
            .reduce((sum, t) => sum + t.amount, 0);
            
          return { category, amount };
        }).filter(item => item.amount > 0);
        
        // Sort by amount (descending)
        expensesByCategory.sort((a, b) => b.amount - a.amount);
        
        if (expensesByCategory.length > 0) {
          const top = expensesByCategory[0];
          response = `Your biggest expense category is ${top.category.name} with ${top.amount.toFixed(2)} MAD spent.`;
        } else {
          response = "You don't have any expenses recorded yet.";
        }
      }
      else if (query.includes('save')) {
        response = "Looking at your spending patterns, here are some saving tips:\n\n1. Set a monthly budget for each category\n2. Track your daily expenses\n3. Identify non-essential expenses that you can reduce\n4. Consider automating your savings with regular transfers to a savings account\n5. Review your subscription services and cancel ones you don't use often";
      }
      else if (query.includes('budget')) {
        const monthlyExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount / 3, 0); // Estimate monthly average
          
        response = `Based on your spending history, I suggest a monthly budget of around ${monthlyExpenses.toFixed(2)} MAD. You might want to allocate this across your main expense categories.`;
      }
      else {
        response = "I'm still learning to answer this type of question. Try asking about your balance, spending patterns, or saving tips!";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      
      <Card className="flex-1 flex flex-col min-h-[70vh]">
        <CardHeader>
          <CardTitle>Smart Wallet Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-wallet-purple text-white'
                        : 'bg-secondary text-primary'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-wallet-purple text-white'
                        : 'bg-secondary'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex mb-4 justify-start">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-100"></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask me something about your finances..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assistant;
