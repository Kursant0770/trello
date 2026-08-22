import { hashPassword } from "./hashPassword";

export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const registerUser = async (userData) => {
  const users = getUsers();

  const existingUser = users.some(
    (user) => user.email === userData.email
  );

  if (existingUser) {
    return {
      success: false,
      message: "Пользователь с таким email уже существует",
    };
  }

  const hashedPassword = await hashPassword(userData.password);

  const newUser = {
    ...userData,
    password: hashedPassword,
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    user: newUser,
  };
};

export const loginUser = async (email, password) => {
  const users = getUsers();

  const user = users.find((user) => user.email === email);

  if (!user) {
    return {
      success: false,
      message: "Пользователь с таким email не найден",
    };
  }

  const hashedPassword = await hashPassword(password);

  if (user.password !== hashedPassword) {
    return {
      success: false,
      message: "Неверный email или пароль",
    };
  }

  localStorage.setItem("isAuth", "true");
  localStorage.setItem("currentUser", JSON.stringify(user));

  return {
    success: true,
    user,
  };
};

export const logoutUser = () => {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isAuth") === "true";
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};