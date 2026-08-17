"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";

// Mock Data for the Hardware Catalog
const HARDWARE_CATALOG = [
  { id: "hw_1", name: "ESP32 NodeMCU", category: "Microcontrollers", price: 450, stock: true },
  { id: "hw_2", name: "Analog pH Sensor Kit", category: "Sensors", price: 1200, stock: true },
  { id: "hw_3", name: "Turbidity Sensor Module", category: "Sensors", price: 350, stock: true },
  { id: "hw_4", name: "OLED Display 0.96 inch", category: "Displays", price: 280, stock: true },
  { id: "hw_5", name: "Waterproof Temp Sensor", category: "Sensors", price: 150, stock: true },
  { id: "hw_6", name: "Jumper Wires (M-M/M-F)", category: "Accessories", price: 80, stock: true },
];

// Mock Data for Order History
const ORDER_HISTORY = [
  {
    orderId: "GRB-8492",
    date: "Aug 12, 2026",
    status: "Delivered",
    items: ["ESP32 NodeMCU x1", "OLED Display 0.96 inch x1", "Waterproof Temp Sensor x2"],
    total: 1030,
    projectRef: "AquaSense Prototype",
  }
];

export default function GoRoboDashboard() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  // Cart Management Functions
  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  // Calculate Cart Totals
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = HARDWARE_CATALOG.find(h => h.id === id);
    return total + (item?.price || 0) * qty;
  }, 0);

  // WhatsApp Checkout Handler
  const handleWhatsAppCheckout = () => {
    const targetPhoneNumber = "919999999999"; // Replace with your actual team WhatsApp number
    
    let message = `*New GoRobo Order Request*%0A`;
    message += `*Student:* Prateet Gogia (25BCE1452)%0A`;
    message += `*Hostel Block:* (Provide Block/Room)%0A%0A`;
    message += `*Items Required:*%0A`;
    
    Object.entries(cart).forEach(([id, qty]) => {
      const item = HARDWARE_CATALOG.find(h => h.id === id);
      if (item) message += `- ${item.name} x${qty} (₹${item.price * qty})%0A`;
    });
    
    message += `%0A*Total Estimated Value:* ₹${totalPrice}%0A%0A`;
    message += `Please confirm availability and delivery timeframe.`;

    window.open(`https://wa.me/${targetPhoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] pb-24 text-slate-200">
      
      {/* Header */}
      <div className="border-b border-white/5 bg-black/20 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
            ← Back to Ecosystem
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-300">Identity: Prateet Gogia (25BCE1452)</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12 space-y-12">
        
        {/* Title Section */}
        <div>
          <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
            Hardware Procurement Hub
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            GoRobo Store
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">
            Select the components required for your hardware projects. We will source them from local electronics stores and deliver them directly to your hostel block. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Catalog Area */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Available Components</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HARDWARE_CATALOG.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <Card key={item.id} className="flex flex-col justify-between p-5 border-white/10 bg-black/40 hover:border-amber-500/30 transition-colors">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] text-amber-500 uppercase">{item.category}</span>
                        <span className="font-mono text-sm text-white">₹{item.price}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{item.name}</h3>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg border border-white/10 p-1">
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded bg-black/50 hover:bg-black text-slate-300 flex items-center justify-center font-mono"> - </button>
                          <span className="w-4 text-center font-mono text-sm">{qty}</span>
                          <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded bg-black/50 hover:bg-black text-slate-300 flex items-center justify-center font-mono"> + </button>
                        </div>
                      ) : (
                        <Button onClick={() => addToCart(item.id)} variant="ghost" className="w-full border border-white/10 hover:border-amber-500/50 hover:text-amber-400">
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Cart & Order History */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Active Cart */}
            <Card className="border-amber-500/30 bg-amber-500/5 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Current Order</h2>
              
              {totalItems === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">Your hardware cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = HARDWARE_CATALOG.find(h => h.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">{item.name} <span className="text-amber-500 font-mono text-xs pl-1">x{qty}</span></span>
                          <span className="font-mono text-slate-400">₹{item.price * qty}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-amber-500/20 pt-4 mt-4 flex justify-between items-center">
                    <span className="font-bold text-white">Estimated Total</span>
                    <span className="font-mono font-bold text-amber-400 text-lg">₹{totalPrice}</span>
                  </div>
                  
                  <Button onClick={handleWhatsAppCheckout} className="w-full mt-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                    Checkout via WhatsApp
                  </Button>
                </div>
              )}
            </Card>

            {/* Order History */}
            <Card className="border-white/10 bg-black/40 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Order History</h2>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Synced w/ AmazeCC</span>
              </div>
              
              <div className="space-y-4">
                {ORDER_HISTORY.map((order, idx) => (
                  <div key={idx} className="border border-white/5 rounded-lg p-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <span className="font-mono text-xs text-amber-500">{order.orderId}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{order.status}</span>
                    </div>
                    <p className="text-xs text-white font-semibold mb-1">{order.projectRef}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{order.items.join(", ")}</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}