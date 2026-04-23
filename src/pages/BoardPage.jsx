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
          { id: "1", title: "Нужно сделать", cards: [], background: "#521a1a" },
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

    const newCols = [...columns];

    if (type === "column") {
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);
      setColumns(newCols);
      return;
    }

    const sIdx = newCols.findIndex(
      (c) => c.id.toString() === source.droppableId,
    );
    const dIdx = newCols.findIndex(
      (c) => c.id.toString() === destination.droppableId,
    );

    const sCards = [...newCols[sIdx].cards];
    const dCards = sIdx === dIdx ? sCards : [...newCols[dIdx].cards];

    const [removedCard] = sCards.splice(source.index, 1);
    dCards.splice(destination.index, 0, removedCard);

    newCols[sIdx] = { ...newCols[sIdx], cards: sCards };
    if (sIdx !== dIdx) newCols[dIdx] = { ...newCols[dIdx], cards: dCards };

    setColumns(newCols);
  };

  const addColumn = (title) => {
    setColumns([
      ...columns,
      { id: crypto.randomUUID(), title, cards: [], background: "#101204" },
    ]);
    setOpenedFormId(null);
  };

  const updateColumnTitle = (id, title) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const deleteColumn = (id) => {
    if (window.confirm("Удалить эту колонку?")) {
      setColumns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const clearColumnTasks = (id) => {
    if (window.confirm("Очистить все задачи?")) {
      setColumns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, cards: [] } : c)),
      );
    }
  };

  const updateColumnBackground = (id, background) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, background } : c)),
    );
  };

  const addCardToColumn = (id, text) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              cards: [
                ...(c.cards || []),
                { id: crypto.randomUUID(), text, completed: false },
              ],
            }
          : c,
      ),
    );
  };

  const updateCardData = (colId, cardId, updates) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId ? { ...c, ...updates } : c,
              ),
            }
          : col,
      ),
    );
  };

  const deleteCard = (colId, cardId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col,
      ),
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
                  background={column.background}
                  onAddCard={(text) => addCardToColumn(column.id, text)}
                  onUpdateTitle={(val) => updateColumnTitle(column.id, val)}
                  onUpdateCard={updateCardData}
                  onDeleteCard={deleteCard}
                  onDeleteColumn={deleteColumn}
                  onClearColumn={clearColumnTasks}
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
