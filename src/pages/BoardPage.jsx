import { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { IoMdAdd } from "react-icons/io";
import { Column } from "../components/board/Column";
import { AddColumnForm } from "../components/board/AddColumnForm";
import { Button } from "../components/ui/Button";

export const BoardPage = () => {
  const [openedFormId, setOpenedFormId] = useState(null);

  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("trello_columns");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "1", title: "Нужно сделать", cards: [], background: "#512020" },
          { id: "2", title: "В процессе", cards: [], background: "#898921" },
          { id: "3", title: "Готово", cards: [], background: "#1d441d" },
        ];
  });

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "column") {
      const newCols = [...columns];
      const [removedColumn] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removedColumn);
      setColumns(newCols);
      return;
    }

    const sourceColIndex = columns.findIndex(
      (col) => col.id.toString() === source.droppableId,
    );
    const destColIndex = columns.findIndex(
      (col) => col.id.toString() === destination.droppableId,
    );

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const sourceCards = [...sourceCol.cards];

    const destCards =
      sourceColIndex === destColIndex ? sourceCards : [...destCol.cards];

    const [removedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, removedCard);

    const newCols = [...columns];
    newCols[sourceColIndex] = { ...sourceCol, cards: sourceCards };

    if (sourceColIndex !== destColIndex) {
      newCols[destColIndex] = { ...destCol, cards: destCards };
    }

    setColumns(newCols);
  };

  const addColumn = (title) => {
    setColumns([...columns, { id: crypto.randomUUID(), title, cards: [] }]);
    setOpenedFormId(null);
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col,
      ),
    );
  };

  const addCardToColumn = (columnId, text) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [
                ...(col.cards || []),
                { id: crypto.randomUUID(), text, completed: false },
              ],
            }
          : col,
      ),
    );
  };

  const deleteColumn = (columnId) => {
    if (window.confirm("Удалить эту колонку и все её карточки?")) {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    }
  };

  const clearColumnTasks = (columnId) => {
    if (window.confirm("Очистить все задачи в этой колонке?")) {
      setColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, cards: [] } : col)),
      );
    }
  };

  const updateColumnBackground = (columnId, color) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, background: color } : col,
      ),
    );
  };

  const updateCardData = (columnId, cardId, updates) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, ...updates } : card,
            ),
          };
        }
        return col;
      }),
    );
  };

  const deleteCard = (columnId, cardId) => {
    setColumns((prev) =>
      prev.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          };
        }
        return column;
      }),
    );
  };

  useEffect(() => {
    localStorage.setItem("trello_columns", JSON.stringify(columns));
  }, [columns]);

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
                  cards={column.cards || []}
                  onAddCard={(text) => addCardToColumn(column.id, text)}
                  onUpdateTitle={(newTitle) =>
                    updateColumnTitle(column.id, newTitle)
                  }
                  onUpdateCard={updateCardData}
                  onDeleteCard={deleteCard}
                  onDeleteColumn={deleteColumn}
                  onClearColumn={clearColumnTasks}
                  onUpdateBg={updateColumnBackground}
                  background={column.background}
                  isFormOpen={openedFormId === column.id}
                  onOpen={(e) => {
                    e.stopPropagation();
                    setOpenedFormId(column.id);
                  }}
                  onClose={() => setOpenedFormId(null)}
                />
              ))}
              <FormSection onClick={(e) => e.stopPropagation()}>
                {openedFormId === "new-column" ? (
                  <AddColumnForm
                    setClose={() => setOpenedFormId(null)}
                    onAdd={addColumn}
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
  min-height: 100vh;
  padding: 10vh 0 0 2vw;
  color: white;
  display: flex;
  gap: 20px;
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
