import React from "react";
import { ShieldOff } from "lucide-react";

const SettingsManagement = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-white border border-gray-100 rounded-3xl shadow-sm p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
          <ShieldOff className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Settings Module Disabled
        </h1>
        <p className="text-gray-500 font-medium mt-3">
          Identity, Infrastructure, and Security Ciphers functionality has been
          removed.
        </p>
      </div>
    </div>
  );
};

export default SettingsManagement;
