
import { useState, ReactNode, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditItemDialogProps {
  item: any;
  onUpdate: (updatedItem: any) => void;
  children?: ReactNode;
}

export default function EditItemDialog({ item, onUpdate, children }: EditItemDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDate, setExpiryDate] = useState(item.expiry_date);

  // Reset state when dialog opens or item changes
  useEffect(() => {
    if (open) {
      setName(item.name);
      setQuantity(item.quantity);
      setExpiryDate(item.expiry_date);
    }
  }, [open, item]);

  const handleSubmit = () => {
    onUpdate({
      id: item.id,
      name,
      quantity,
      expiry_date: expiryDate,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button variant="outline" className="px-3">Edit</Button>}
      </DialogTrigger>

      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update item details</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Item Name</Label>
            <Input
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Quantity</Label>
            <Input
              type="number"
              className="col-span-3"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Expiry</Label>
            <Input
              type="date"
              className="col-span-3"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
