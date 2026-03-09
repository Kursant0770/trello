import { TextField} from "@mui/material";

export const InputMUI = ({
  label,
  type,
  name,
  register,
  rules,
  error,
  helperText,
  autoComplete,
  endAdornment,
  ...props
}) => {
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      autoComplete={autoComplete}
      {...props}
      {...register(name, rules)}
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: endAdornment,
        },
      }}
    />
  );
};

export const Input = ({
  label,
  type,
  name,
  register,
  rules,
  error,
  helperText,
  autoComplete,
  endAdornment,
  ...rest
}) => {
  return (
    <input
      {...rest}
      type={type}
      autoComplete={autoComplete}
      {...(typeof register === "function" ? register(name, rules) : { name })}
    />
  );
};
