
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, PlusCircle, MinusCircle, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { balance, transactions, categories, addTransaction, updateBalance } = useWallet();
  const { toast } = useToast();
  
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  
  const [newBalance, setNewBalance] = useState(balance.toString());
  
  const handleAddTransaction = () => {
    const amount = parseFloat(transactionAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (!transactionCategory) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    addTransaction({
      amount,
      type: transactionType,
      category: transactionCategory,
      description: transactionDescription,
      date: new Date().toISOString(),
    });
    
    toast({
      title: "Transaction added",
      description: `${transactionType === 'expense' ? 'Expense' : 'Income'} of ${amount} MAD added successfully`,
    });
    
    setTransactionAmount("");
    setTransactionCategory("");
    setTransactionDescription("");
    setOpenTransactionDialog(false);
  };
  
  const handleUpdateBalance = () => {
    const amount = parseFloat(newBalance);
    
    if (isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    updateBalance(amount);
    
    toast({
      title: "Balance updated",
      description: `Balance updated to ${amount} MAD`,
    });
    
    setOpenBalanceDialog(false);
  };
  
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setTransactionType('expense');
              setOpenTransactionDialog(true);
            }}
          >
            <MinusCircle className="mr-2 h-4 w-4" />
            Expense
          </Button>
          <Button
            onClick={() => {
              setTransactionType('income');
              setOpenTransactionDialog(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Income
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-3 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Balance</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => {
              setNewBalance(balance.toString());
              setOpenBalanceDialog(true);
            }}>
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{balance.toFixed(2)} MAD</div>
            <div className="text-sm text-muted-foreground mt-1">Available Balance</div>
            {balance < 100 && (
              <div className="mt-3 text-sm font-medium text-destructive">
                Warning: Balance below 100 MAD threshold
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)} MAD
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Expenses</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Income Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)} MAD
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Income</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" onClick={() => window.location.href = '/transactions'}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="divide-y">
              {recentTransactions.map((transaction) => {
                const category = categories.find(c => c.id === transaction.category);
                
                return (
                  <div key={transaction.id} className="expense-item">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'expense' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                        }`}
                      >
                        {transaction.type === 'expense' ? 
                          <ArrowDown className="h-5 w-5" /> : 
                          <ArrowUp className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.description || category?.name || 'Unnamed Transaction'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`${
                          transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                        } font-medium`}
                      >
                        {transaction.type === 'expense' ? '-' : '+'}
                        {transaction.amount.toFixed(2)} MAD
                      </span>
                      {category && (
                        <span 
                          className="category-pill"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <div className="mb-2">No transactions yet</div>
              <Button onClick={() => setOpenTransactionDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Transaction Dialog */}
      <Dialog open={openTransactionDialog} onOpenChange={setOpenTransactionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (MAD)</Label>
              <Input
                id="amount"
                placeholder="0.00"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={transactionCategory} onValueChange={setTransactionCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(c => 
                      transactionType === 'expense' 
                        ? !c.name.toLowerCase().includes('income') && c.name !== 'salary'
                        : c.name.toLowerCase().includes('income') || c.name.toLowerCase() === 'salary'
                    )
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTransactionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>
              {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Balance Update Dialog */}
      <Dialog open={openBalanceDialog} onOpenChange={setOpenBalanceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newBalance">New Balance (MAD)</Label>
              <Input
                id="newBalance"
                placeholder="0.00"
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenBalanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBalance}>
              Update Balance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
