import { FaTrello } from "react-icons/fa6";
import { NavLink } from "react-router";
import styled from "styled-components";
import AccountMenu from "./AccountMenu";

export const Header = () => {
  return (
    <StyledHeader>
      <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>
          <FaTrello /> Trello
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
  z-index: 1000;

  width: 100%;
  background: #1f1f21;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 14px;

  h1 {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  a.active {
    color: #007bff; 
    font-weight: bold;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  margin: 0 2rem;
  gap: 5vw;

  a {
    text-decoration: none;
    color: white;
    font-size: 24px;
  }
`;
