import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/ui/Button";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth") === "true";

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Страница не найдена</Title>
      <Description>
        Похоже, вы перешли по неверной ссылке.
      </Description>
      <StyledButton 
        onClick={() => navigate(isAuth ? "/board" : "/login")}
      >
        {isAuth ? "Вернуться на доску" : "Перейти к логину"}
      </StyledButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  height: 80vh;
  color: #ff0000;
  text-align: center;
  padding: 20px;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  margin: 0;
  color: #e43c3c;
  text-shadow: 0px 4px 10px rgba(241, 102, 102, 0.58);
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #ff3c3c;
  margin-bottom: 30px;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  background: #4784df;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  
  &:hover {
    background: #6499e9;
    transition: 0.3s;
  }
  &:active {
    background: #4784df;
    transition: 0.3s;
  }
`;
