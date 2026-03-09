import { useState } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const AddColumnForm = ({ setClose, onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle("");
      setClose();
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <StyledInput
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        placeholder="Ввести заголовок списка"
        autoFocus
      />

      <ActionGroup>
        <StyledAddButton type="submit">Добавить список</StyledAddButton>
        <StyledBackButton type="button" onClick={setClose}>
          <IoMdClose size={24} />
        </StyledBackButton>
      </ActionGroup>
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  background-color: #101204; /* Темный фон под стать колонке */
  border-radius: 12px;
  width: 272px;
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled(Input)`
  background: #22272b;
  color: #ffffff;
  border: 1px solid #3e3f42;
  border-radius: 4px;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  outline: none;

  &:focus {
    border-color: #85b8ff;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const StyledAddButton = styled(Button)`
  background: #0c66e4;
  color: black;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 12px;
  font-weight: 500;

  &:hover {
    background-color: #0055cc;
  }

  &:active {
    background: #0c66e4;
  }
`;

const StyledBackButton = styled.button`
  background: transparent;
  border: none;
  color: #b6c2cf;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;
