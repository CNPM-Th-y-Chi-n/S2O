import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Save, RefreshCcw } from 'lucide-react';

const AccountSettings: React.FC = () => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://192.168.1.81:5000/api/auth/update-settings', 
                { username, fullname, oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: response.data.message });
            // Xóa trắng ô pass sau khi đổi thành công
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <RefreshCcw className="text-blue-500" /> Cài đặt tài khoản
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Phần 1: Thông tin cơ bản */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <User size={20} /> Thông tin cá nhân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Username mới"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Họ và tên mới"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                </div>

                <hr />

                {/* Phần 2: Bảo mật */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Lock size={20} /> Đổi mật khẩu
                    </h3>
                    <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                {message.text && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {loading ? 'Đang cập nhật...' : <><Save size={20} /> Lưu thay đổi</>}
                </button>
            </form>
        </div>
    );
};

export default AccountSettings;