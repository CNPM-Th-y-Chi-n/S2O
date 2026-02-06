import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, UserX, UserCheck, X } from "lucide-react";

const BASE_URL = "http://localhost:5000/api";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  username: string;
  active: boolean;
}

export function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal thêm nhân viên
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  // 1. Hàm lấy danh sách nhân viên
  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/manager/restaurant/staff`);
      setStaff(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 2. Hàm xử lý thêm nhân viên
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/manager/restaurant/staff/add`, formData);
      alert("Thêm nhân viên thành công!");
      setIsModalOpen(false);
      setFormData({ fullName: '', username: '', password: '', email: '', phone: '' }); // Reset form
      fetchStaff(); // Load lại danh sách
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm nhân viên. Vui lòng kiểm tra lại username (có thể bị trùng).");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager": return "bg-purple-100 text-purple-700";
      case "staff": return "bg-blue-100 text-blue-700";
      case "kitchen": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const activeStaffCount = staff.filter(s => s.active).length;
  const inactiveStaffCount = staff.filter(s => !s.active).length;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-600">Active Staff</p>
            <p className="text-2xl font-bold">{loading ? "..." : activeStaffCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-gray-500">{loading ? "..." : inactiveStaffCount}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      @{member.username}
                    </span>
                  </div>
                </div>

                {member.active ? (
                  <UserCheck className="text-green-600 w-5 h-5" />
                ) : (
                  <UserX className="text-gray-400 w-5 h-5" />
                )}
              </div>

              <p className="text-sm text-gray-600 truncate">📧 {member.email}</p>
              <p className="text-sm text-gray-600">📞 {member.phone}</p>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-50 text-blue-700 p-2 rounded flex items-center justify-center gap-1 hover:bg-blue-100 transition">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className={`flex-1 p-2 rounded transition ${member.active ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                  {member.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm nhân viên mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input 
                  type="text" required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                  <input 
                    type="text" required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input 
                    type="password" required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input 
                  type="text" required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}