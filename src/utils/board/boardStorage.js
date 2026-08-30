const STORAGE_KEY = "trello_columns";

const DEFAULT_COLUMNS = [
  { id: "1", title: "Нужно сделать", cards: [], background: "#521a1a" },
  { id: "2", title: "В процессе", cards: [], background: "#898921" },
  { id: "3", title: "Готово", cards: [], background: "#1d441d" },
];

export const getColumns = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return DEFAULT_COLUMNS;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_COLUMNS;
  }
};

export const saveColumns = (columns) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
};
