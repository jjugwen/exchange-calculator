import React from "react";

function CurrencyBox(props) {
  const { opt, selectedNation, handleSelected, money, onChange, currencyName } = props;
  // const amount = money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  let amount
  amount = money.toLocaleString('ko-KR', {maximumFractionDigits: 2})
  // const amount = parseFloat(comma).toFixed(2);
  return (
    <div className="input-row">
      <input type="text" min={0} onChange={onChange} value={amount} />
      <select value={selectedNation} onChange={handleSelected}>
        {opt}
      </select>
      <span>{currencyName}</span>
    </div>
  );
}

export default CurrencyBox;
