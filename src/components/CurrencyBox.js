import React from "react";
import styled, { ThemeProvider } from "styled-components";

function CurrencyBox(props) {
  const { opt, selectedNation, handleSelected, money, onChange,} = props;
  let amount
  amount = money.toLocaleString('ko-KR', {maximumFractionDigits: 2});
  return (
    <ThemeProvider theme={props.theme}>
      <Input>
      <input type="text" min={0} onChange={onChange} value={amount} aria-label={selectedNation}/>
        <select value={selectedNation} onChange={handleSelected}>
        {opt}
      </select>
    </Input>
    </ThemeProvider>
  );
}

const Input = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 1%;
  width: 100%;
  max-width: 243px;
`

export default CurrencyBox;
