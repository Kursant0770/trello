import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoMdAdd } from "react-icons/io";
import { AddCardForm } from "./AddCardForm";
import { Card } from "./Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ColumnMenu } from "./ColumnMenu";

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
  onAddComment,
  onDeleteComment,
  onUpdateBg,
  isFormOpen,
  onOpen,
  onClose,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleAddCard = (text) => {
    onAddCard(text);
    onClose();
  };

  const handleTitleSubmit = () => {
    const trimmedTitle = tempTitle.trim();

    setIsEditingTitle(false);

    if (trimmedTitle && trimmedTitle !== title) {
      onUpdateTitle(trimmedTitle);
    } else {
      setTempTitle(title);
    }
  };

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

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

            <ColumnMenu
              columnId={columnId}
              onClearColumn={onClearColumn}
              onDeleteColumn={onDeleteColumn}
              onUpdateBg={onUpdateBg}
            />
          </Header>

          <Droppable droppableId={columnId.toString()} type="card">
            {(provided) => (
              <CardsContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards.map((card, index) => (
                  <Card
                    key={card.id}
                    index={index}
                    card={card}
                    columnId={columnId}
                    onUpdateCard={onUpdateCard}
                    onDeleteCard={onDeleteCard}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
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
  min-height: 1vh;
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
