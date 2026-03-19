import { useContext, useState } from 'react';
import { Plus, Lock, Eye, EyeOff, Copy, Trash2, RefreshCw, Shield, Key, Globe, User, FileText } from 'lucide-react';
import { AppContext } from '../App';
import Header from '../components/Header';
import PasswordCard from '../components/PasswordCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { syncPasswords } from '../services/dataSync';
import { generatePassword, checkPasswordStrength, generateId } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';

function Vault() {
    const { passwords, setPasswords } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', username: '', password: '', url: '', notes: '' });
    const [generatorOptions] = useState({ length: 16, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true });

    const { theme } = useSettings();

    const passwordStrength = checkPasswordStrength(formData.password);
    const filteredPasswords = passwords.filter(pass => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return pass.name.toLowerCase().includes(query) || pass.username.toLowerCase().includes(query) || pass.url?.toLowerCase().includes(query);
    });

    const securityStats = {
        total: filteredPasswords.length,
        strong: filteredPasswords.filter(p => p.strength === 'strong').length,
        medium: filteredPasswords.filter(p => p.strength === 'medium').length,
        weak: filteredPasswords.filter(p => p.strength === 'weak').length
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeneratePassword = () => {
        const newPassword = generatePassword(generatorOptions.length, generatorOptions);
        setFormData(prev => ({ ...prev, password: newPassword }));
    };

    const handleCopyPassword = (password) => {
        navigator.clipboard.writeText(password);
        setToast({ visible: true, message: 'Password copied!', type: 'success' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.password) {
            setToast({ visible: true, message: 'Please fill all required fields', type: 'error' });
            return;
        }
        try {
            const getFavicon = (name) => {
                const favicons = { 'google': '🔵', 'github': '⚫', 'amazon': '🟠', 'netflix': '🔴', 'facebook': '🔵', 'twitter': '🐦', 'instagram': '📸', 'linkedin': '💼' };
                return favicons[name.toLowerCase()] || '🔑';
            };
            const passwordData = { name: formData.name, username: formData.username, password: formData.password, url: formData.url, notes: formData.notes, strength: checkPasswordStrength(formData.password), favicon: getFavicon(formData.name) };
            if (editingPassword) {
                const updated = { ...passwordData, id: editingPassword.id };
                await syncPasswords.update(editingPassword.id, updated);
                setPasswords(prev => prev.map(p => p.id === editingPassword.id ? updated : p));
                setToast({ visible: true, message: 'Password updated!', type: 'success' });
            } else {
                const created = { ...passwordData, id: generateId() };
                await syncPasswords.create(created);
                setPasswords(prev => [...prev, created]);
                setToast({ visible: true, message: 'Password saved!', type: 'success' });
            }
            closeModal();
        } catch (error) {
            console.error('Error saving password:', error);
            setToast({ visible: true, message: error.message || 'Error saving password', type: 'error' });
        }
    };

    const handleEdit = (password) => {
        setEditingPassword(password);
        setFormData({ name: password.name, username: password.username, password: password.password, url: password.url, notes: password.notes });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await syncPasswords.delete(id);
            setPasswords(prev => prev.filter(p => p.id !== id));
            setToast({ visible: true, message: 'Password deleted', type: 'success' });
        } catch (error) {
            console.error('Error deleting password:', error);
            setToast({ visible: true, message: error.message || 'Error deleting password', type: 'error' });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPassword(null);
        setShowPassword(false);
        setFormData({ name: '', username: '', password: '', url: '', notes: '' });
    };

    const getStrengthColor = (s) => s === 'strong' ? '#22c55e' : s === 'medium' ? '#eab308' : '#ef4444';
    const getStrengthClass = (s) => s === 'strong' ? 'text-success' : s === 'medium' ? 'text-warning' : 'text-danger';

    return (
        <div className="animate-fade-in">
            <Header onSearch={setSearchQuery} />
            <section className="px-4 mb-6 mt-28">
                <div className={`
                ${theme === 'dark' ? 'bg-[#1a1a24] text-white/60' : 'bg-gray-200 text-gray-600'}
                
                
                
                rounded-xl p-4 border border-white/5`}>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-accent-gradient rounded-xl flex items-center justify-center"><Shield className='text-bg-primary' size={28} /></div>
                        <div><div className="text-sm text-text-tertiary">Password Vault</div><div className="text-2xl font-bold">{securityStats.total} saved</div></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-success/10 rounded-lg text-center"><div className="text-xl font-bold text-success">{securityStats.strong}</div><div className="text-xs text-text-tertiary">Strong</div></div>
                        <div className="p-3 bg-warning/10 rounded-lg text-center"><div className="text-xl font-bold text-warning">{securityStats.medium}</div><div className="text-xs text-text-tertiary">Medium</div></div>
                        <div className="p-3 bg-danger/10 rounded-lg text-center"><div className="text-xl font-bold text-danger">{securityStats.weak}</div><div className="text-xs text-text-tertiary">Weak</div></div>
                    </div>
                    <button className="w-full mt-5 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95" onClick={() => setShowModal(true)}><Plus size={18} /> Add Password</button>
                </div>
            </section>
            <section className="px-4 mb-6">
                <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold">Saved Passwords</h2></div>
                {filteredPasswords.length > 0 ? filteredPasswords.map(p => <PasswordCard key={p.id} password={p} onClick={() => handleEdit(p)} onCopy={() => handleCopyPassword(p.password)} />) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <Lock size={48} className="text-white/20" />
                        <h3 className="text-lg font-semibold text-white/80">{searchQuery ? 'No passwords found' : 'No passwords saved'}</h3>
                        <p className="text-sm text-text-tertiary">{searchQuery ? 'Try another search' : 'Add your first password'}</p>
                        {!searchQuery && <button className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white" onClick={() => setShowModal(true)}><Plus size={18} /> Add Password</button>}
                    </div>
                )}
            </section>
            <Modal isOpen={showModal} onClose={closeModal} title={editingPassword ? 'Edit Password' : 'Add Password'} footer={<><button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-bg-tertiary text-text-secondary hover:bg-bg-hover" onClick={closeModal}>Cancel</button><button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white" onClick={handleSubmit}>{editingPassword ? 'Update' : 'Save'}</button></>}>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 mb-4"><label className="text-sm font-medium text-white/80 flex items-center gap-1.5"><Key size={14} />Service Name *</label><input type="text" name="name" className="input" placeholder="e.g., Google" value={formData.name} onChange={handleInputChange} /></div>
                    <div className="flex flex-col gap-2 mb-4"><label className="text-sm font-medium text-white/80 flex items-center gap-1.5"><User size={14} />Username / Email *</label><input type="text" name="username" className="input" placeholder="user@email.com" value={formData.username} onChange={handleInputChange} /></div>
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-1.5"><Lock size={14} />Password *</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password" className="input pr-20" placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                <button type="button" className="p-2 rounded-lg text-text-secondary hover:bg-white/5" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                <button type="button" className="p-2 rounded-lg text-text-secondary hover:bg-white/5" onClick={handleGeneratePassword}><RefreshCw size={16} /></button>
                            </div>
                        </div>
                        {formData.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1, 2, 3, 4].map(i => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= (passwordStrength === 'strong' ? 4 : passwordStrength === 'medium' ? 2 : 1) ? getStrengthColor(passwordStrength) : '#1a1a24' }} />)}</div><div className={`text-xs ${getStrengthClass(passwordStrength)}`}>{passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} password</div></div>}
                    </div>
                    <div className="flex flex-col gap-2 mb-4"><label className="text-sm font-medium text-white/80 flex items-center gap-1.5"><Globe size={14} />Website URL</label><input type="url" name="url" className="input" placeholder="https://example.com" value={formData.url} onChange={handleInputChange} /></div>
                    <div className="flex flex-col gap-2 mb-4"><label className="text-sm font-medium text-white/80 flex items-center gap-1.5"><FileText size={14} />Notes</label><textarea name="notes" className="input resize-none" placeholder="Add notes..." rows={3} value={formData.notes} onChange={handleInputChange} /></div>
                    {editingPassword && <button type="button" className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-danger text-white mt-3" onClick={() => { handleDelete(editingPassword.id); closeModal(); }}><Trash2 size={16} /> Delete Password</button>}
                </form>
            </Modal>
            <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
        </div>
    );
}

export default Vault;
