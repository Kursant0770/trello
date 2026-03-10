import { useState } from "react";
import styled from "styled-components";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Draggable } from "@hello-pangea/dnd";
import { AiOutlineDelete } from "react-icons/ai";
import { Checkbox } from "@mui/material";
import { MdRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";

export const Card = ({ card, columnId, onUpdateCard, index, onDeleteCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    name: "Guest",
  };

  const saveUpdates = (updates) => {
    onUpdateCard(columnId, card.id, updates);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: crypto.randomUUID(),
        userName: user.name,
        text: commentText,
        date: new Date().toLocaleString(),
      };

      saveUpdates({ comments: [...(card.comments || []), newComment] });
      setCommentText("");
    }
  };

  const handleToggleChecked = (e) => {
    e.stopPropagation();
    onUpdateCard(columnId, card.id, { completed: !card.completed });
  };

  const handleDeleteComment = (commentId) => {
    const filtered = card.comments.filter((c) => c.id !== commentId);
    saveUpdates({ comments: filtered });
  };

  const handleDeleteCard = (e) => {
    e.stopPropagation();

    if (onDeleteCard) {
      onDeleteCard(columnId, card.id);
    }
  };

  return (
    <>
      <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <StyledCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setIsModalOpen(true)}
        >
          <CardContent>
            <Checkbox
              checked={!!card.completed}
              onChange={handleToggleChecked}
              onClick={(e) => e.stopPropagation()}
              icon={<MdRadioButtonUnchecked size={22} color="#b6c2cf" />} 
              checkedIcon={<MdCheckCircle size={22} color="#4caf50" />}
              sx={{ p: 0 }}
            />

            <CardText $done={card.completed}>{card.text}</CardText>

            {card.completed && (
              <DeleteIconButton onClick={handleDeleteCard}>
                <AiOutlineDelete size={18} />
              </DeleteIconButton>
            )}
          </CardContent>
        </StyledCard>
      )}
    </Draggable>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <TitleSection>
            <StyledTitleInput
              value={card.text}
              onChange={(e) => saveUpdates({ text: e.target.value })}
            />
          </TitleSection>

          <Section>
            <h4>Описание</h4>
            <StyledInput
              as="textarea"
              placeholder="Добавить описание..."
              value={card.description || ""}
              onChange={(e) => saveUpdates({ description: e.target.value })}
            />
          </Section>

          <Section>
            <h4>Комментарии</h4>
            <StyledInputComment
              placeholder="Напишите комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <StyledButton onClick={handleAddComment}>Сохранить</StyledButton>

            <CommentsList>
              {card.comments?.map((c) => (
                <StyledCommentBox key={c.id}>
                  <strong style={{ color: "#007bff" }}>{c.userName}</strong>
                  <p>{c.text}</p>
                  <DeleteText onClick={() => handleDeleteComment(c.id)}>
                    Удалить
                  </DeleteText>
                </StyledCommentBox>
              ))}
            </CommentsList>
          </Section>
        </ModalContent>
      </Modal>
    </>
  );
};

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 30px;
`;

const CardText = styled.span`
  flex-grow: 1;
  transition: 0.2s;
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  opacity: ${({ $done }) => ($done ? 0.5 : 1)};
`;

const DeleteIconButton = styled.div`
  padding: 4px;
  color: #ef5350;
  border-radius: 4px;
  transition: 0.2s;
  
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 83, 80, 0.2);
    color: #f44336;
  }
`;

const StyledTitleInput = styled(Input)`
  width: 90%;
  padding: 2px 6px;

  background: #22272b;
  color: white;
  font-size: 20px;
  font-weight: bold;

  outline: none;
  border: 2px solid #22272b;
  border-radius: 8px;

  &:focus {
    border: 2px solid #0079bf;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
`;

const TitleSection = styled.div`
  h2 {
    color: white;
    font-size: 20px;
    cursor: pointer;

    padding: 4px 8px;
    margin: 0;
    border-radius: 4px;

    &:hover {
      background: #ffffff1a;
    }
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h4 {
    color: white;
    margin-bottom: 12px;
    font-size: 16px;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 12px;
  min-height: 120px;

  background: #2c333a;
  color: white;
  border: 1px solid #3e3f42;
  border-radius: 8px;

  resize: none;
`;

const StyledInputComment = styled(Input)`
  width: 100%;
  padding: 12px;

  background: #2c333a;
  border: 1px solid #3e3f42;
  color: white;
  border-radius: 8px;
`;

const StyledCommentBox = styled.div`
  width: 100%;
  padding: 12px;
  margin-top: 12px;

  background: #2c333a;
  color: white;
  border-radius: 8px;

  strong {
    font-size: 13px;
    color: #b6c2cf;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const DeleteText = styled.span`
  font-size: 11px;
  color: #cecfd2;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #ef5350;
  }
`;

const CommentsList = styled.div`
  width: 100%;
  margin-top: 15px;
  max-height: 215px;

  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #2c333a;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #5e6c84;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #85b8ff;
  }
`;

const StyledButton = styled(Button)`
  padding: 8px 16px;
  margin-top: 10px;
  
  color: black;
  background: #2668ca;
  font-size: 14px;
  cursor: pointer;
  
  border: none;
  border-radius: 4px;


  &:hover {
    background-color: #3b7ad9;
  }
`;

const StyledCard = styled.div`
  padding: 8px 12px;
  margin-bottom: 8px;

  background: #22272b;
  color: #b6c2cf;
  font-size: 14px;
  cursor: pointer;

  border: 1px solid #22272b;
  border-radius: 8px;
  word-break: break-word;

  &:hover {
    border: 1px solid #85b8ff;
  }
`;
