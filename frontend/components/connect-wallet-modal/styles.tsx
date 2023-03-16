import styled from "styled-components";

export const ConnectorList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Connector = styled.div`
  display: flex;
  border: 1px solid #BBB;
  padding: 15px 15px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: #eee;
    border: 1px solid #ddd;
  }
  span {
    margin-left: 15px;
    position: relative;
    top: 3px;
    font-size: 1.3rem;
    font-weight: 600;
    color: #000;
  }
`;

export const Warning = styled.div`
  margin-bottom: 20px;
  color: #999;
  font-size: 1.2rem;
`;

export const Alert = styled.div `
margin-bottom: 20px;
color: red;
font-size: 1.2rem;
font-weight: 300;
width: 100%;
margin-top: 20px;
`;

export const Agreement = styled.div`
  margin-top: 15px;
  color: #777;
  text-style: italic;
  font-size: 1rem;
`;

export const AddressStyle = styled.div`
  border: 1px solid #ddd;
  background: #FFF;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  font-size: 1.2rem;
  border-radius: 10px;
  box-shadow: inset 0 0 1px 1px #EEE;
`;
