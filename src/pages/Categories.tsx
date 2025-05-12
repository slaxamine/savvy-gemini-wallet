
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet, Category } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Categories = () => {
  const { categories, addCategory, deleteCategory, transactions } = useWallet();
  const { toast } = useToast();
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6E59A5");
  
  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      // Check if there are transactions using this category
      const hasTransactions = transactions.some(t => t.category === categoryToDelete);
      
      if (hasTransactions) {
        toast({
          title: "Cannot delete category",
          description: "This category is being used in transactions. Please remove those transactions first.",
          variant: "destructive",
        });
      } else {
        deleteCategory(categoryToDelete);
        toast({
          title: "Category deleted",
          description: "Category has been removed successfully",
        });
      }
      
      setOpenDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid category name",
        variant: "destructive",
      });
      return;
    }
    
    // Check if category name already exists
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({
        title: "Category exists",
        description: "A category with this name already exists",
        variant: "destructive",
      });
      return;
    }
    
    addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: 'category',
    });
    
    toast({
      title: "Category added",
      description: "New category has been added successfully",
    });
    
    setNewCategoryName("");
    setNewCategoryColor("#6E59A5");
    setOpenAddDialog(false);
  };
  
  // Group categories by type
  const expenseCategories = categories.filter(c => !c.name.toLowerCase().includes('income') && c.name.toLowerCase() !== 'salary');
  const incomeCategories = categories.filter(c => c.name.toLowerCase().includes('income') || c.name.toLowerCase() === 'salary');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {expenseCategories.map((category) => (
                <div key={category.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => confirmDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {expenseCategories.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No expense categories found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {incomeCategories.map((category) => (
                <div key={category.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => confirmDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {incomeCategories.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No income categories found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Category Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  className="w-16 h-10 p-1"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                />
                <div 
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: newCategoryColor }}
                ></div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
