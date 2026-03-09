import { Button as MuiButton } from "@mui/material";

export const ButtonMUI = ({ children, ...props }) => {
  return (
    <MuiButton variant="contained" size="large" {...props}>
      {children}
    </MuiButton>
  );
};

export const Button = ({ children, ...props }) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
};
