import React from 'react';
import FlipkartCard from '../components/FlipkartCard';

const Products = () => {
  const products = [
    { id: 1, title: "Chocolate Chip Cookies (7pcs)", price: "239", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 2, title: "Chocolate Chip Cookies (9pcs)", price: "349", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 3, title: "Dry Fruit Cookies (5pcs)", price: "299", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 4, title: "Double Chocolate Chip Cookies (7pcs)", price: "239", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 5, title: "Oreo Cookies (7pcs)", price: "239", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 6, title: "Red Velvet Cookies (8pcs)", price: "399", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cookies" },
    { id: 11, title: "Ragulu Unpolished Grains (500gm)", price: "34", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ", category: "Millets" },
    { id: 12, title: "Sajjalu Unpolished Grains (500gm)", price: "35", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ", category: "Millets" },
    { id: 13, title: "White Jower Unpolished Grains (500gm)", price: "40", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ", category: "Millets" },
    { id: 14, title: "Korralu unpolished Grains (500gm)", price: "55", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ", category: "Millets" },
  ];

  return (
    <div className="pt-24 xl:pt-40 pb-20 xl:pb-32 px-6 xl:px-10 max-w-[1700px] mx-auto min-h-screen">
      <div className="mb-12 xl:mb-20 animate-slide-right opacity-0 fill-mode-forwards px-4 xl:px-0">
         <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Our Full Catalog</span>
         <h1 className="text-4xl xl:text-7xl font-serif font-black text-primary italic leading-none">The Collection</h1>
         <p className="mt-6 xl:mt-8 text-stone-500 font-medium italic max-w-xl text-base xl:text-lg leading-relaxed">From heritage bakes to unpolished nutrition, explore the complete range of Daksha Artisanal treats.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12">
        {products.map(p => (
           <FlipkartCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
};

export default Products;

