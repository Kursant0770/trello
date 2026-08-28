import { useEffect, useState } from "react";
import { getColumns, saveColumns } from "../utils/board/boardStorage";

export const useBoard = () => {
  const [columns, setColumns] = useState(getColumns);

  const moveColumn = (sourceIndex, destinationIndex) => {
    setColumns((prev) => {
      const newColumns = [...prev];

      const [removedColumn] = newColumns.splice(sourceIndex, 1);

      newColumns.splice(destinationIndex, 0, removedColumn);

      return newColumns;
    });
  };

  const moveCard = (source, destination) => {
    setColumns((prev) => {
      const newColumns = [...prev];

      const sourceIndex = newColumns.findIndex(
        (column) => column.id.toString() === source.droppableId,
      );

      const destinationIndex = newColumns.findIndex(
        (column) => column.id.toString() === destination.droppableId,
      );

      const sourceCards = [...newColumns[sourceIndex].cards];

      const destinationCards =
        sourceIndex === destinationIndex
          ? sourceCards
          : [...newColumns[destinationIndex].cards];

      const [removedCard] = sourceCards.splice(source.index, 1);

      destinationCards.splice(destination.index, 0, removedCard);

      newColumns[sourceIndex] = {
        ...newColumns[sourceIndex],
        cards: sourceCards,
      };

      if (sourceIndex !== destinationIndex) {
        newColumns[destinationIndex] = {
          ...newColumns[destinationIndex],
          cards: destinationCards,
        };
      }

      return newColumns;
    });
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "column") {
      moveColumn(source.index, destination.index);
      return;
    }

    moveCard(source, destination);
  };

  const addColumn = (title) => {
    setColumns((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        cards: [],
        background: "#101204",
      },
    ]);
  };

  const updateColumnTitle = (id, title) => {
    setColumns((prev) =>
      prev.map((column) => (column.id === id ? { ...column, title } : column)),
    );
  };

  const deleteColumn = (id) => {
    if (window.confirm("Удалить эту колонку?")) {
      setColumns((prev) => prev.filter((column) => column.id !== id));
    }
  };

  const clearColumnTasks = (id) => {
    if (window.confirm("Очистить все задачи?")) {
      setColumns((prev) =>
        prev.map((column) =>
          column.id === id ? { ...column, cards: [] } : column,
        ),
      );
    }
  };

  const updateColumnBackground = (id, background) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, background } : column,
      ),
    );
  };

  const addCardToColumn = (id, text) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id
          ? {
              ...column,
              cards: [
                ...column.cards,
                {
                  id: crypto.randomUUID(),
                  text,
                  description: "",
                  completed: false,
                  comments: [],
                },
              ],
            }
          : column,
      ),
    );
  };

  const updateCardData = (columnId, cardId, updates) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card,
              ),
            }
          : column,
      ),
    );
  };

  const deleteCard = (columnId, cardId) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            }
          : column,
      ),
    );
  };

  const addComment = (columnId, cardId, comment) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId
                  ? {
                      ...card,
                      comments: [...card.comments, comment],
                    }
                  : card,
              ),
            }
          : column,
      ),
    );
  };

  const deleteComment = (columnId, cardId, commentId) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId
                  ? {
                      ...card,
                      comments: card.comments.filter(
                        (comment) => comment.id !== commentId,
                      ),
                    }
                  : card,
              ),
            }
          : column,
      ),
    );
  };

  useEffect(() => {
    saveColumns(columns);
  }, [columns]);

  return {
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
  };
};
