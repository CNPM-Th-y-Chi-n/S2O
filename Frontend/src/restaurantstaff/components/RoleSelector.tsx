import { UserRole } from "../context/AppContext";
import { Shield, Users, ChefHat } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: UserRole, name: string) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      role: "manager" as UserRole,
      name: "John Manager",
      title: "Restaurant Manager",
      icon: Shield,
      color: "bg-purple-50 border-purple-300",
    },
    {
      role: "staff" as UserRole,
      name: "Sarah Staff",
      title: "Service Staff",
      icon: Users,
      color: "bg-blue-50 border-blue-300",
    },
    {
      role: "kitchen" as UserRole,
      name: "Chef Marco",
      title: "Kitchen Staff",
      icon: ChefHat,
      color: "bg-orange-50 border-orange-300",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Select your role
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                onClick={() => onSelectRole(r.role, r.name)}
                className={`border rounded-xl p-6 text-left hover:shadow-lg transition ${r.color}`}
              >
                <Icon className="w-8 h-8 mb-4" />
                <h2 className="font-bold text-lg">{r.title}</h2>
                <p className="text-sm text-gray-600">{r.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
