
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet, Transaction } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { ArrowUp, ArrowDown, Trash2, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const Transactions = () => {
  const { transactions, categories, deleteTransaction } = useWallet();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setOpenDeleteDialog(false);
      setTransactionToDelete(null);
      
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed successfully",
      });
    }
  };
  
  const filteredTransactions = transactions.filter((transaction) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories
        .find((c) => c.id === transaction.category)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    // Category filter
    const matchesCategory = categoryFilter === "" || transaction.category === categoryFilter;
    
    // Type filter
    const matchesType = typeFilter === "" || transaction.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{categoryFilter ? "Category" : "All Categories"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{typeFilter ? (typeFilter === "expense" ? "Expenses" : "Income") : "All Types"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => {
                const category = categories.find((c) => c.id === transaction.category);
                
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
                          {format(new Date(transaction.date), 'MMMM dd, yyyy')}
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
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <div className="mb-2">No transactions found</div>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Add Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTransaction}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
