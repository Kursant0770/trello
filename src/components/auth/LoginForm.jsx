import { styled, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { InputMUI } from "../ui/Input";
import { ButtonMUI } from "../ui/Button";
import icon from "../../assets/logo.png";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/auth";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandle = async (data) => {
    const result = await loginUser(data.email, data.password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    navigate("/board");
  };

  return (
    <Wrapper>
      <FormContainer component="form" onSubmit={handleSubmit(submitHandle)}>
        <Logo>
          <img src={icon} alt="logo" width={60} /> Trello
        </Logo>

        <StyledText variant="h5" fontWeight={600}>
          Вход
        </StyledText>

        <InputMUI
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          register={register}
          rules={{
            required: "Введите ваш email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Введите корректный email",
            },
          }}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <InputMUI
          label="Пароль"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          register={register}
          rules={{
            required: "Введите пароль",
            minLength: {
              value: 6,
              message: "Пароль должен быть минимум 6 символов",
            },
          }}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          endAdornment={
            <ShowPasswordButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </ShowPasswordButton>
          }
        />

        <ButtonMUI type="submit" color="success">
          Войти
        </ButtonMUI>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Нет аккаунта?{" "}
          <Link
            to="/registration"
            style={{
              color: "#2e7d32",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Зарегистрироваться
          </Link>
        </Typography>
      </FormContainer>
    </Wrapper>
  );
};

const FormContainer = styled(Box)(({ theme }) => ({
  width: 420,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: "#fff",
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const Wrapper = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
});

const ShowPasswordButton = styled("button")({
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#666",
});

const Logo = styled("h1")({
  fontSize: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  margin: "0 0 20px 0",
});

const StyledText = styled(Typography)({
  textAlign: "center",
  marginBottom: "10px",
});
