import { mockStaff } from "../data/mockData";
import { Plus, Edit, UserX, UserCheck } from "lucide-react";

export function Staff() {
  // ⬅️ LẤY DATA TRỰC TIẾP (KHÔNG DÙNG PROPS)
  const staff = mockStaff;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-700";
      case "staff":
        return "bg-blue-100 text-blue-700";
      case "kitchen":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const activeStaff = staff.filter(s => s.active).length;
  const inactiveStaff = staff.filter(s => !s.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-600">Active Staff</p>
            <p className="text-2xl font-bold">{activeStaff}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-gray-500">{inactiveStaff}</p>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div
            key={member.id}
            className="bg-white border rounded-lg p-4"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <span
                  className={`inline-block px-2 py-0.5 text-xs rounded ${getRoleBadgeColor(
                    member.role
                  )}`}
                >
                  {member.role}
                </span>
              </div>

              {member.active ? (
                <UserCheck className="text-green-600" />
              ) : (
                <UserX className="text-gray-400" />
              )}
            </div>

            <p className="text-sm text-gray-600">{member.email}</p>
            <p className="text-sm text-gray-600">{member.phone}</p>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-50 text-blue-700 p-2 rounded flex items-center justify-center gap-1">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                className={`flex-1 p-2 rounded ${
                  member.active
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {member.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
