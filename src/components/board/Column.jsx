import { useState } from "react";
import styled from "styled-components";
import { IoMdAdd } from "react-icons/io";
import { AddCardForm } from "./AddCardForm";
import { Card } from "./Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
} from "@mui/material";

export const Column = ({
  columnId,
  index,
  title,
  cards,
  background,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onUpdateTitle,
  onDeleteColumn,
  onClearColumn,
  onUpdateBg,
  isFormOpen,
  onOpen,
  onClose,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddCard = (text) => {
    onAddCard(text);
    onClose();
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && tempTitle !== title) {
      onUpdateTitle(tempTitle);
    } else {
      setTempTitle(title);
    }
  };

  return (
    <Draggable draggableId={columnId.toString()} index={index}>
      {(provided) => (
        <StyledColumn
          $bg={background}
          onClick={(e) => e.stopPropagation()}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header {...provided.dragHandleProps}>
            {isEditingTitle ? (
              <StyledTitleInput
                autoFocus
                value={tempTitle}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              />
            ) : (
              <StyledHeaderH3 onClick={() => setIsEditingTitle(true)}>
                {title}
              </StyledHeaderH3>
            )}

            <IconButton onClick={handleClick}>
              <BiDotsHorizontalRounded />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              disableScrollLock
              PaperProps={{
                style: {
                  background: "#282e33",
                  color: "#b6c2cf",
                  width: "200px",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  onClearColumn(columnId);
                  handleClose();
                }}
              >
                Очистить список
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onDeleteColumn(columnId);
                  handleClose();
                }}
                sx={{ color: "#ef5350" }}
              >
                Удалить колонку
              </MenuItem>
              <Box sx={{ display: "flex", gap: 1, p: 1, flexWrap: "wrap" }}>
                {["#101204", "#1f3e5c", "#646418", "#521a1a", "#1d441d"].map(
                  (color) => (
                    <Box
                      key={color}
                      onClick={() => onUpdateBg(columnId, color)}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: color,
                        cursor: "pointer",
                        border: "1px solid #fff",
                        borderRadius: "4px",
                      }}
                    />
                  ),
                )}
              </Box>
            </Menu>
          </Header>
          <Droppable droppableId={columnId.toString()} type="card">
            {(provided) => (
              <CardsContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards?.map((card, index) => (
                  <Card
                    key={card.id}
                    index={index}
                    card={card}
                    columnId={columnId}
                    onUpdateCard={onUpdateCard}
                    onDeleteCard={onDeleteCard}
                  />
                ))}
                {provided.placeholder}
              </CardsContainer>
            )}
          </Droppable>

          {isFormOpen ? (
            <AddCardForm onAdd={handleAddCard} onClose={onClose} />
          ) : (
            <StyledCardButton onClick={onOpen}>
              <IoMdAdd size={20} /> Добавить карточку
            </StyledCardButton>
          )}
        </StyledColumn>
      )}
    </Draggable>
  );
};

const StyledColumn = styled.div`
  padding: 12px;
  width: 300px;
  max-height: 80vh;

  color: #ffffff;
  background: ${(props) => props.$bg || "#101204"};
  transition: 0.3s ease;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: fit-content;
`;

const Header = styled.div`
  min-height: 32px;
  margin-bottom: 12px;

  display: flex;
  justify-content: space-between;

  button {
    border: none;
    cursor: pointer;
    background: transparent !important;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
`;

const StyledHeaderH3 = styled.h3`
  margin: 0;
  padding: 4px 8px;
  width: 85%;
  border-radius: 4px;

  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

const StyledTitleInput = styled(Input)`
  width: 85%;
  height: 28px;
  padding: 0 8px;

  background: #242528;
  color: white;
  font-size: 14px;
  font-weight: 600;

  border: 1px solid #669df1;
  border-radius: 4px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  overflow-y: auto;
  padding: 0 4px 0 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
  }
`;

const StyledCardButton = styled(Button)`
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  color: #b6c2cf;
  background: transparent;
  font-size: 14px;
  cursor: pointer;

  border: none;
  border-radius: 8px;

  &:hover {
    background-color: #ffffff1a;
    color: #ffffff;
  }
`;
