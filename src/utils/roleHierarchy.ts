import { User } from "@/types/user";

export const getFilteredUsersByRole = (
  role: string,
  users: User[] | undefined
): User[] | undefined => {
  const roleHierarchy: Record<string, string[]> = {
    manager: ["manager"],
    bse: ["manager", "bse"],
    leader: ["manager", "bse", "leader"],
    subleader: ["manager", "bse", "leader", "subleader"],
  };

  return roleHierarchy[role]
    ? users?.filter((user) => roleHierarchy[role].includes(user.role))
    : users;
};
