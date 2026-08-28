import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import styled from "styled-components";

const COLORS = ["#101204", "#1f3e5c", "#898921", "#521a1a", "#1d441d"];

export const ColumnMenu = ({
  columnId,
  onClearColumn,
  onDeleteColumn,
  onUpdateBg,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledIconButton onClick={handleOpen}>
        <BiDotsHorizontalRounded />
      </StyledIconButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
      >
        <MenuItem
          onClick={() => {
            onClearColumn(columnId);
            handleClose();
          }}
        >
          Очистить список
        </MenuItem>

        <DeleteMenuItem
          onClick={() => {
            onDeleteColumn(columnId);
            handleClose();
          }}
        >
          Удалить колонку
        </DeleteMenuItem>

        <ColorsContainer>
          {COLORS.map((color) => (
            <ColorButton
              key={color}
              $color={color}
              onClick={() => {
                onUpdateBg(columnId, color);
                handleClose();
              }}
            />
          ))}
        </ColorsContainer>
      </StyledMenu>
    </>
  );
};

const StyledIconButton = styled(IconButton)`
  color: white !important;
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    width: 200px;
    background: #282e33;
    color: #b6c2cf;
  }
`;

const DeleteMenuItem = styled(MenuItem)`
  color: #ef5350 !important;
`;

const ColorsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-wrap: wrap;
`;

const ColorButton = styled.button.attrs({
  type: "button",
})`
  width: 24px;
  height: 24px;
  padding: 0;

  background: ${(props) => props.$color};
  border: 1px solid #fff;
  border-radius: 4px;

  cursor: pointer;
`;
