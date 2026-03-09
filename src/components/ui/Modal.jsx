import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

export const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{title}</h2>
          <CloseButton onClick={onClose}>
            <IoMdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: #22272b;
  color: #b6c2cf;

  width: 768px;
  max-width: 95%;
  max-height: 80%;
  min-height: 400px;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;

  h2 {
    font-size: 20px;
    color: white;
    margin: 0;

    word-break: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #b6c2cf;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 0 20px 20px 20px;
  overflow-y: auto;
`;
