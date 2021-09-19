import styled from 'styled-components'

export const Container = styled.button`
  height: 42px;
  padding: 0 24px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  background: #348feb;
  border-radius: 8px;
  border: 0;

  color: #FFF;
  font-size: 16px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    filter: brightness(0.7);
  }
`
