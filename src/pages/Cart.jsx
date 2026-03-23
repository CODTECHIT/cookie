import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([
    { id: 1, title: 'Cashew Butter Cookies', price: 199, qty: 1, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY', weight: '250g', tagline: 'Traditional Hearth Baked' },
    { id: 2, title: 'Organic Pearl Millet', price: 145, qty: 2, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ', weight: '1kg', tagline: 'Nutrient Rich & Gluten-Free' },
    { id: 3, title: 'Millet & Honey Granola', price: 320, qty: 1, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY', weight: '400g', tagline: 'Cold Pressed & Natural' },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const savings = 65;
  const total = subtotal - savings;

  const updateQty = (id, delta) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-40 px-6 max-w-[1700px] mx-auto min-h-screen">
        <div className="text-center mb-12">
           <h1 className="text-5xl font-serif font-bold text-primary mb-4 italic">Shopping Bag</h1>
           <p className="text-stone-400">Your bag is currently empty.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-[3rem] border border-stone-100">
           <span className="material-symbols-outlined text-7xl text-stone-200 mb-8">shopping_bag</span>
           <Link to="/products" className="bg-[#331917] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-xl transition-all">
              Start Shopping
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 px-4 xl:px-10 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-black text-primary italic mb-2">Shopping Bag</h1>
        <p className="text-sm font-medium text-stone-400 italic">You have {items.length} items in your cart.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row gap-8 items-center border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow flex flex-col sm:flex-row justify-between w-full h-full items-start">
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-bold text-primary mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-400 font-medium mb-6">
                    {item.weight} • {item.tagline}
                  </p>
                  
                  {/* Qty Selector */}
                  <div className="flex items-center gap-6 bg-stone-50 p-1.5 rounded-xl border border-stone-200 w-fit mt-auto">
                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                    <span className="text-sm font-bold text-primary">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
                  </div>
                </div>

                <div className="flex flex-col items-end h-full justify-between sm:pt-2">
                  <span className="text-2xl font-bold text-primary">₹{item.price * item.qty}</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-primary/30 hover:text-red-600 transition-colors uppercase tracking-widest mt-auto mb-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:gap-4 transition-all pt-10">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Continue Shopping
          </Link>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#F8F5F0] rounded-[2.5rem] p-10 border border-stone-100">
            <h2 className="text-2xl font-serif font-black text-primary italic mb-8">Price Details</h2>
            
            <div className="space-y-4 mb-10 text-sm font-medium">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-primary font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping Charges</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-[#D4A017]">
                <span>Total Savings</span>
                <span className="font-bold">- ₹{savings}</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-xl font-serif font-black text-primary italic">Grand Total</span>
                <span className="text-4xl font-serif font-black text-primary italic leading-none">₹{total}</span>
              </div>
            </div>

            <button className="w-full bg-[#331917] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 mb-10">
              Proceed to Checkout
            </button>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-100 text-center">
                  <span className="material-symbols-outlined text-[#D4A017] mb-2">security</span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Secure Payment</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-100 text-center">
                  <span className="material-symbols-outlined text-[#D4A017] mb-2">autorenew</span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Easy Returns</span>
               </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-between px-8 py-5 bg-[#F8F5F0] border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#D4A017]">sell</span>
              <span className="text-sm font-bold text-stone-600">Apply Coupon</span>
            </div>
            <span className="material-symbols-outlined text-stone-400">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;


