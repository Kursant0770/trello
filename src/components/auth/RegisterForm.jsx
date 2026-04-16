import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, useWatch } from "react-hook-form";
import { InputMUI } from "../ui/Input";
import icon from "../../assets/logo.png";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [passVisible, setPassVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  const password = useWatch({
    control,
    name: "password",
  });

  const submitHandle = (data) => {
    const { confirmPassword: _confirmPassword, ...userData } = data;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((user) => user.email === userData.email)) {
      alert("Пользователь с таким email уже существует");
      return;
    }

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Регистрация успешна");
    navigate("/login");
  };

  return (
    <Wrapper>
      <FormContainer component="form" onSubmit={handleSubmit(submitHandle)}>
        <LogoBox>
          <img src={icon} alt="logo" width={40} />
          <Typography variant="h4" fontWeight={700}>
            Trello
          </Typography>
        </LogoBox>

        <StyledText variant="h5" fontWeight={600}>
          Регистрация
        </StyledText>

        <InputMUI
          label="Имя"
          name="name"
          register={register}
          rules={{
            required: "Введите ваше имя",
            minLength: { value: 2, message: "Минимум 2 символа" },
            pattern: {
              value: /^[A-Za-zА-Яа-яЁё\s]+$/,
              message: "Только буквы",
            },
          }}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />

        <InputMUI
          label="Email"
          type="email"
          name="email"
          register={register}
          rules={{
            required: "Введите email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Некорректный email",
            },
          }}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <InputMUI
          label="Пароль"
          type={passVisible ? "text" : "password"}
          name="password"
          register={register}
          rules={{
            required: "Введите пароль",
            minLength: { value: 6, message: "Минимум 6 символов" },
          }}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          endAdornment={
            <IconButton
              type="button"
              onClick={() => setPassVisible(!passVisible)}
            >
              {passVisible ? <BiHide /> : <BiShow />}
            </IconButton>
          }
        />

        <InputMUI
          label="Подтвердите пароль"
          type={confirmVisible ? "text" : "password"}
          name="confirmPassword"
          register={register}
          rules={{
            required: "Повторите пароль",
            validate: (value) => value === password || "Пароли не совпадают",
          }}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          endAdornment={
            <IconButton
              type="button"
              onClick={() => setConfirmVisible(!confirmVisible)}
            >
              {confirmVisible ? <BiHide /> : <BiShow />}
            </IconButton>
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 1 }}
        >
          Зарегистрироваться
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Есть аккаунт?{" "}
          <Link
            to="/login"
            style={{
              color: "#2e7d32",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Войти
          </Link>
        </Typography>
      </FormContainer>
    </Wrapper>
  );
};

const FormContainer = styled(Box)({
  width: 420,
  padding: "32px",
  borderRadius: "16px",
  backgroundColor: "#fff",
  boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Wrapper = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
});

const IconButton = styled("button")({
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#666",
});

const LogoBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "8px",
});

const StyledText = styled(Typography)({
  textAlign: "center",
});
