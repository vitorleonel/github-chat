import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  position: fixed;
  bottom: 0;
  right: 24px;

  * {
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;

    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  &.hidden {
    ul,
    textarea {
      display: none;
    }
  }

  &:not(.hidden) {
    header svg {
      transform: rotate(180deg);
    }
  }
`;

export const Header = styled.header`
  background-color: #24292e;
  color: #ffffff;
  font-weight: 600;
  padding: 14px 16px;
  cursor: pointer;

  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h1 {
    max-width: 88%;
    display: flex;

    span:first-child {
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: 4px;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Messages = styled.ul`
  max-height: 60vh;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #e1e4e8;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const Message = styled.li`
  margin: 0;
  padding: 4px 14px;

  &:not(:last-child) {
    margin-bottom: 4px;
  }

  a {
    font-weight: 600;
    color: #1b1f23;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    padding-left: 4px;
    color: #586069;
  }
`;

export const Write = styled.textarea`
  width: 100%;
  border: 1px solid #e1e4e8;
  border-top: none;

  padding: 14px;
  resize: none;
  display: block;

  &:focus {
    outline: none;
  }
`;
