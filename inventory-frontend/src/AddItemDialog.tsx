import { useState } from "react";
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


interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
}

export default function AddItemDialog({ onAdd }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");

const handleSubmit = () => {
  if (!name || !quantity || !expiryDate) return;

  onAdd({
    name,
    quantity: Number(quantity),
    expiry_date: expiryDate,   // FIXED
  } as any);

  setName("");
  setQuantity("");
  setExpiryDate("");
  setOpen(false);
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2">
          + Add Item
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new inventory item.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Item Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              className="col-span-3"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value ? Number(e.target.value) : "")
              }
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expiry Date
            </Label>
            <Input
              id="expiry"
              type="date"
              className="col-span-3"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
