
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Pencil, Trash2, CheckCircle, AlertCircle, AlertTriangle, Filter } from "lucide-react";
import { motion } from "framer-motion";
import AddItemDialog from "./AddItemDialog";
import EditItemDialog from "./EditItemDialog";
import logo from "@/assets/logo.svg";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  status: string;
  notified: boolean;
}

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export default function InventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
const [notifications, setNotifications] = useState<string[]>([]);
const [showNotifPanel, setShowNotifPanel] = useState(false);

  const [showNameFilter, setShowNameFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const nameRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
// Icon ref
const nameIconRef = useRef<HTMLDivElement>(null);
// Popup ref (used to detect outside clicks)
const namePopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await API.get<InventoryItem[]>("/items/");
        setItems(response.data);
        setFilteredItems(response.data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter items whenever filters change
  useEffect(() => {
    let temp = [...items];
    if (nameFilter) temp = temp.filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()));
    if (statusFilter) temp = temp.filter(item => getStatus(item.expiry_date) === statusFilter);
    setFilteredItems(temp);
  }, [nameFilter, statusFilter, items]);

  // Close filter popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(event.target as Node)) setShowNameFilter(false);
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setShowStatusFilter(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatus = (expiryDate: string) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    if (exp < today) return "Expired";
    const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 7) return "Expiring Soon";
    return "Safe";
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "Safe": return <span className="flex items-center gap-1 text-green-500 font-semibold"><CheckCircle size={16} />{status}</span>;
      case "Expiring Soon": return <span className="flex items-center gap-1 text-yellow-400 font-semibold"><AlertTriangle size={16} />{status}</span>;
      case "Expired": return <span className="flex items-center gap-1 text-red-500 font-semibold"><AlertCircle size={16} />{status}</span>;
      default: return status;
    }
  };

  if (loading) return <p className="text-white">Loading inventory...</p>;

  return (
    <motion.div className="p-6 space-y-6 min-h-screen bg-gray-900 text-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <AddItemDialog onAdd={(item) => setItems(prev => [...prev, item])} />
<Button variant="destructive" onClick={() => setShowNotifPanel(!showNotifPanel)}>
  <Bell size={18} />
  {notifications.length > 0 && (
    <span className="ml-1 text-red-400 font-bold">({notifications.length})</span>
  )}
</Button>
{showNotifPanel && (
  <div className="absolute right-6 top-16 bg-gray-800 text-white p-4 rounded-xl shadow-lg w-64 z-50 border border-gray-600">
    <h3 className="font-bold mb-2">Notifications</h3>

    {notifications.length === 0 ? (
      <p className="text-gray-400 text-sm">No notifications</p>
    ) : (
      notifications.map((n, idx) => (
        <div key={idx} className="p-2 mb-1 rounded bg-gray-700 text-sm">
          {n}
        </div>
      ))
    )}

    <Button
      size="sm"
      className="mt-3 w-full"
      onClick={() => setNotifications([])}
    >
      Clear
    </Button>
  </div>
)}

        </div>
      </div>

      {/* Table */}
      <Card className="bg-gray-800 text-gray-100">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Name Column with Filter */}
                {/* Name Column with Filter */}
             <TableHead>
               <div ref={nameRef} className="relative flex items-center gap-1">
                 <span>Name</span>
                 <Filter
                   className="cursor-pointer"
                   size={16}
                   onClick={() => setShowNameFilter(!showNameFilter)}
                 />

                 {/* Name Filter Popup inside relative div */}
                 {showNameFilter && (
                   <div className="absolute top-full mt-1 right-0 bg-gray-700 p-3 rounded w-48 shadow-xl border border-gray-600 z-50">
                     <Input
                       placeholder="Filter Name"
                       value={nameFilter}
                       onChange={(e) => setNameFilter(e.target.value)}
                       className="text-sm mb-2"
                     />
                     <Button size="sm" onClick={() => setNameFilter("")} className="w-full">
                       Clear
                     </Button>
                   </div>
                 )}
               </div>
             </TableHead>



                <TableHead>Quantity</TableHead>

                {/* Expiry Date */}
                <TableHead>Expiry Date</TableHead>

                {/* Status Column with Filter */}
                <TableHead>
                     <div ref={statusRef} className="flex items-center gap-1 relative">
                       <span>Status</span>
                       <Filter
                         className="cursor-pointer"
                         size={16}
                         onClick={() => setShowStatusFilter(!showStatusFilter)}
                       />
                       {showStatusFilter && (
                         <div className="absolute top-full mt-1 right-0 bg-gray-700 p-3 rounded w-48 shadow-xl border border-gray-600 z-50">
                           <select
                             value={statusFilter}
                             onChange={(e) => setStatusFilter(e.target.value)}
                             className="w-full text-sm bg-gray-800 border border-gray-600 rounded p-2 mb-2"
                           >
                             <option value="">All</option>
                             <option value="Safe">Safe</option>
                             <option value="Expiring Soon">Expiring Soon</option>
                             <option value="Expired">Expired</option>
                           </select>

                           <Button
                             size="sm"
                             onClick={() => setStatusFilter("")}
                             className="w-full"
                           >
                             Clear
                           </Button>
                         </div>
                       )}

                     </div>
                   </TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-700">
                  <TableCell>{item.name}</TableCell>
                  <TableCell>  {item.quantity === 0 ? (
                                 <span className="flex items-center gap-1 text-red-400 font-semibold">
                                   <AlertTriangle size={16} /> Out of Stock
                                 </span>
                               ) : (
                                 item.quantity
                               )}</TableCell>
                  <TableCell>{item.expiry_date}</TableCell>
                  <TableCell>{renderStatus(getStatus(item.expiry_date))}</TableCell>
                  <TableCell className="flex gap-2">
                  <EditItemDialog
                    item={item}
                    onUpdate={async (updated) => {
                      try {
                        const res = await API.put(`/items/${updated.id}`, updated);

                        // update items in UI
                        setItems(prev => prev.map(i => i.id === updated.id ? res.data : i));

                        // Capture notification if backend sent one
                        if (res.data.notification) {
                          setNotifications(prev => [...prev, res.data.notification]);
                        }

                      } catch (err) {
                        console.error("Update failed:", err);
                      }
                    }}
                  >
                    <Button variant="destructive" className="px-3"><Pencil size={16} /></Button>
                  </EditItemDialog>
<Button
  variant="destructive"
  className="px-3"
  onClick={async () => {
    try {
      await API.delete(`/items/${item.id}`);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }}
>
  <Trash2 size={16} />
</Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

