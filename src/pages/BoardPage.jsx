import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { IoMdAdd } from "react-icons/io";
import { Column } from "../components/board/Column";
import { AddColumnForm } from "../components/board/AddColumnForm";
import { Button } from "../components/ui/Button";
import { useBoard } from "../hooks/useBoard";

export const BoardPage = () => {
  const [openedFormId, setOpenedFormId] = useState(null);

  const {
    columns,
    onDragEnd,
    addColumn,
    updateColumnTitle,
    deleteColumn,
    clearColumnTasks,
    updateColumnBackground,
    addCardToColumn,
    updateCardData,
    deleteCard,
    addComment,
    deleteComment,
  } = useBoard();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledBoard onClick={() => setOpenedFormId(null)}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <ColumnsContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  index={index}
                  columnId={column.id}
                  title={column.title}
                  cards={column.cards}
                  background={column.background}
                  onAddCard={(text) => addCardToColumn(column.id, text)}
                  onUpdateTitle={(val) => updateColumnTitle(column.id, val)}
                  onUpdateCard={updateCardData}
                  onDeleteCard={deleteCard}
                  onDeleteColumn={deleteColumn}
                  onClearColumn={clearColumnTasks}
                  onAddComment={addComment}
                  onDeleteComment={deleteComment}
                  onUpdateBg={updateColumnBackground}
                  isFormOpen={openedFormId === column.id}
                  onOpen={(e) => {
                    e.stopPropagation();
                    setOpenedFormId(column.id);
                  }}
                  onClose={() => setOpenedFormId(null)}
                />
              ))}

              {provided.placeholder}

              <FormSection onClick={(e) => e.stopPropagation()}>
                {openedFormId === "new-column" ? (
                  <AddColumnForm
                    setClose={() => setOpenedFormId(null)}
                    onAdd={(title) => {
                      addColumn(title);
                      setOpenedFormId(null);
                    }}
                  />
                ) : (
                  <StyledButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenedFormId("new-column");
                    }}
                  >
                    <IoMdAdd /> Добавить список
                  </StyledButton>
                )}
              </FormSection>
            </ColumnsContainer>
          )}
        </Droppable>
      </StyledBoard>
    </DragDropContext>
  );
};

const StyledBoard = styled.div`
  min-height: 100%;
  color: white;
  display: flex;
`;

const ColumnsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const FormSection = styled.div`
  min-width: 272px;
`;

const StyledButton = styled(Button)`
  padding: 10px;
  width: 272px;
  height: 44px;

  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(1px);

  border: none;
  border-radius: 12px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 16px;
  line-height: 20px;
  cursor: pointer;

  &:hover {
    background: rgba(222, 222, 222, 0.425);
    transition: 0.3ms;
  }
`;
