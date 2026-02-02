
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Settings, Store, Users, RotateCcw, Shield, Key, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { Vendor, User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  vendors, 
  setVendors, 
  users, 
  setUsers
}) => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'users' | 'api'>('vendors');
  
  // Vendor State
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  // User State
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiSaveMessage, setApiSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('GEMINI_CUSTOM_API_KEY') || '';
      setApiKey(storedKey);
      setApiSaveMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddVendor = () => {
    if (newName.trim() && newCode.trim()) {
      setVendors([...vendors, { 
        id: Date.now().toString(), 
        name: newName.trim(), 
        code: newCode.trim() 
      }]);
      setNewName('');
      setNewCode('');
    }
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  const handleResetPassword = (username: string) => {
    if (confirm(`Are you sure you want to reset the password for ${username}?`)) {
      const defaultPass = "Welcome@1234";
      setUsers(prev => prev.map(u => 
        u.username === username ? { ...u, password: defaultPass } : u
      ));
      setResetMessage(`Password for ${username} reset to: ${defaultPass}`);
      setTimeout(() => setResetMessage(null), 5000);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_CUSTOM_API_KEY', apiKey.trim());
    } else {
      localStorage.removeItem('GEMINI_CUSTOM_API_KEY');
    }
    setApiSaveMessage("API Key updated successfully.");
    setTimeout(() => setApiSaveMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
               <Settings size={20} className="text-slate-600" />
            </div>
            <h3 className="font-serif font-bold text-xl">Admin Console</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

         {/* Tabs */}
         <div className="flex border-b border-slate-100 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('vendors')}
            className={`flex-1 min-w-[100px] py-3 text-xs font-semibold transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'vendors' ? 'text-primary-700 bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Store size={14}/> Vendors
            {activeTab === 'vendors' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[100px] py-3 text-xs font-semibold transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'users' ? 'text-primary-700 bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={14}/> Users
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`flex-1 min-w-[100px] py-3 text-xs font-semibold transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'api' ? 'text-primary-700 bg-primary-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Key size={14}/> API Config
            {activeTab === 'api' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {activeTab === 'vendors' && (
            <>
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Add New Vendor</h4>
                {/* Add Form */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Vendor Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Silk House"
                      className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Vendor Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="e.g. Mou"
                        className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddVendor()}
                      />
                      <button 
                        onClick={handleAddVendor}
                        disabled={!newName.trim() || !newCode.trim()}
                        className="px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Active Vendors ({vendors.length})</span>
                </div>
                <div className="space-y-2">
                    {vendors.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm">
                        No vendors added yet.
                      </div>
                    ) : (
                      vendors.map(vendor => (
                        <div key={vendor.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-primary-100 transition-colors group">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{vendor.name}</p>
                            <p className="text-xs text-slate-500 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded mt-1">{vendor.code}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
               {resetMessage && (
                 <div className="p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm mb-4">
                   {resetMessage}
                 </div>
               )}
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">System Users ({users.length})</span>
               </div>
               {users.map(user => (
                 <div key={user.username} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                         {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-500">@{user.username}</span>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                             {user.role}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleResetPassword(user.username)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Reset Password"
                    >
                      <RotateCcw size={16} />
                    </button>
                 </div>
               ))}

               <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                 <div className="flex items-center gap-2 mb-1 font-bold text-slate-700">
                   <Shield size={14} /> Security Note
                 </div>
                 Admins can reset any user's password. The default temporary password is <strong>Welcome@1234</strong>.
               </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Google Gemini API Key</h4>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[10px] text-amber-700 mb-4">
                   <p className="font-bold mb-1">Note for GitHub Deployment:</p>
                   If you are using this app outside of AI Studio, enter your Gemini API key below. 
                   This key will be saved locally in your browser and used for all AI generations (Try-On, Product Shots, Analytics).
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Key size={16} />
                  </div>
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key..."
                    className="w-full pl-10 pr-10 p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {apiSaveMessage && (
                  <div className="mt-3 p-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[10px] font-medium flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={12} /> {apiSaveMessage}
                  </div>
                )}

                <button
                  onClick={handleSaveApiKey}
                  className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
                >
                  <Save size={18} />
                  Save API Key
                </button>

                <div className="mt-6 p-4 bg-slate-50 rounded-xl text-[10px] text-slate-500 border border-slate-200 leading-relaxed">
                  <p className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Shield size={12} /> Key Usage Policy
                  </p>
                  This application uses <strong>Gemini 2.5 Flash</strong> and <strong>Gemini 2.5 Flash Image</strong> models. 
                  Ensure your API key has access to these models and sufficient quota for image generation. 
                  Your key is stored in <code>localStorage</code> and never sent to any server other than Google's official Gemini API endpoints.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
           <button onClick={onClose} className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
             Done
           </button>
        </div>
      </div>
    </div>
  );
};
