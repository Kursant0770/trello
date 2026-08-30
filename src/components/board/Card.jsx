import { useState } from "react";
import styled from "styled-components";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Draggable } from "@hello-pangea/dnd";
import { AiOutlineDelete } from "react-icons/ai";
import { Checkbox } from "@mui/material";
import { MdRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";
import { getCurrentUser } from "../../utils/userStorage";

export const Card = ({
  card,
  columnId,
  onUpdateCard,
  index,
  onDeleteCard,
  onAddComment,
  onDeleteComment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const user = getCurrentUser();

  const saveUpdates = (updates) => {
    onUpdateCard(columnId, card.id, updates);
  };

  const handleAddComment = () => {
    const text = commentText.trim();

    if (!text) return;

    const newComment = {
      id: crypto.randomUUID(),
      userName: user.name,
      text,
      date: new Date().toLocaleString(),
    };

    onAddComment(columnId, card.id, newComment);

    setCommentText("");
  };

  const handleToggleChecked = (e) => {
    e.stopPropagation();
    onUpdateCard(columnId, card.id, { completed: !card.completed });
  };

  const handleDeleteComment = (commentId) => {
    onDeleteComment(columnId, card.id, commentId);
  };

  const handleDeleteCard = (e) => {
    e.stopPropagation();
    onDeleteCard(columnId, card.id);
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
                checked={card.completed}
                onChange={handleToggleChecked}
                onClick={(e) => e.stopPropagation()}
                icon={<MdRadioButtonUnchecked size={22} color="#b6c2cf" />}
                checkedIcon={<MdCheckCircle size={22} color="#4caf50" />}
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
          <StyledTitleInput
            value={card.text}
            onChange={(e) => saveUpdates({ text: e.target.value })}
          />

          <Section>
            <h4>Описание</h4>
            <StyledInput
              as="textarea"
              placeholder="Добавить описание..."
              value={card.description}
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
              {card.comments.map((comment) => (
                <StyledCommentBox key={comment.id}>
                  <CommentUser>{comment.userName}</CommentUser>
                  <p>{comment.text}</p>
                  <DeleteText onClick={() => handleDeleteComment(comment.id)}>
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
  width: 100%;
  min-height: 30px;

  display: flex;
  align-items: center;
  gap: 10px;
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
  padding: 10px 20px;

  display: flex;
  flex-direction: column;
  gap: 20px;
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

  p {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const DeleteText = styled.span`
  font-size: 11px;
  color: #ef5350;
  text-decoration: underline;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    color: #e77c7c;
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
  padding: 4px 12px;
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

const CommentUser = styled.strong`
  color: #007bff;
  font-size: 13px;
`;
