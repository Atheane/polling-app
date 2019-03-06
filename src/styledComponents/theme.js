
import styled from 'styled-components';

export const Button = styled.button`
  padding: 5px 25px;
  background-color: #1d8094;
  background-image: linear-gradient(0deg, #1d8094 0%, #47b6a4 100%);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  font-family: sans-serif;
  filter: hue-rotate(0deg);
  transition: filter 300ms linear;
  cursor: pointer;
  &:focus,
  &:hover {
    filter: hue-rotate(45deg);
  }
`;