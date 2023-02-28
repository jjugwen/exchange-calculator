import React from "react";

function CurrencyBox(props) {
  const { opt, selectedCurrency, handleSelected, money, onChange, nation } = props;
  // const amount = money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  let amount
  amount = money.toLocaleString('ko-KR', {maximumFractionDigits: 2})
  // const amount = parseFloat(comma).toFixed(2);
  return (
    <div className="input-row">
      <input type="text" min={0} onChange={onChange} value={amount} />
      <select value={selectedCurrency} onChange={handleSelected}>
        {opt}
      </select>
      <span>{nation}</span>
    </div>
  );
}

export default CurrencyBox;
