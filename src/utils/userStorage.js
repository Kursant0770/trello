const STORAGE_KEY = "currentUser";

export const getCurrentUser = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return { name: "Guest" };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return { name: "Guest" };
  }
};