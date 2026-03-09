import { useState } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const AddCardForm = ({ onAdd, onClose }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText("");
      onClose(); // Закрываем форму после успешного добавления
    }
  };

  return (
    <CardFormWrapper onSubmit={handleSubmit}>
      <StyledTextArea
        as="textarea"
        autoFocus
        placeholder="Ввести заголовок для этой карточки"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
      />
      <StyledActionGroup>
        <StyledAddButton type="submit">
          Добавить карточку
        </StyledAddButton>
        
        <StyledCloseButton type="button" onClick={onClose}>
          <IoMdClose size={24} />
        </StyledCloseButton>
      </StyledActionGroup>
    </CardFormWrapper>
  );
};

const CardFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

const StyledTextArea = styled(Input)`
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  
  color: #ffffff;
  background: #22272b;
  border: 1px solid #3e3f42;
  border-radius: 8px;
  
  outline: none;
  resize: none;

  &:focus {
    border-color: #85b8ff;
  }
`;

const StyledActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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

const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #b6c2cf;
  cursor: pointer;
  display: flex;
  padding: 4px;

  &:hover {
    color: #ffffff;
  }
`;
