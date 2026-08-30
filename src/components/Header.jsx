import { FaTrello } from "react-icons/fa6";
import { NavLink } from "react-router";
import styled from "styled-components";
import AccountMenu from "./AccountMenu";

export const Header = () => {
  return (
    <StyledHeader>
      <NavLink to="/" className="logo">
        <h1>
          <FaTrello />
          <span>Trello</span>
        </h1>
      </NavLink>

      <StyledNav>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/board">Board</NavLink>

        <AccountMenu />
      </StyledNav>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100%;
  min-height: 64px;

  background: #1f1f21;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 24px;

  .logo {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 28px;
  }

  a.active {
    color: #007bff;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;

    h1 {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 12px;

    h1 {
      font-size: 20px;
      gap: 6px;
    }
  }
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  a {
    text-decoration: none;
    color: white;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    gap: 18px;

    a {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    gap: 10px;

    a {
      font-size: 16px;
    }
  }
`;
