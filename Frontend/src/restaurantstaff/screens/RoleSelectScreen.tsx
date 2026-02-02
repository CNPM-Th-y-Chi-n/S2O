import { useNavigate } from "react-router-dom";
import { RoleSelector } from "../components/RoleSelector";
import { useApp } from "../context/AppContext";
import { UserRole } from "../context/AppContext";

export default function RoleSelectScreen() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  const handleSelectRole = (role: UserRole, name: string) => {
    setCurrentUser({
      id: "1",
      name,
      role,
    });

    navigate(`/staff/${role}`);
  };

  return <RoleSelector onSelectRole={handleSelectRole} />;
}
