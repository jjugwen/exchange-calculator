import React from "react";

function CurrencyBox(props) {
  const { opt, selectedNation, handleSelected, money, onChange,} = props;
  // const amount = money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  let amount
  amount = money.toLocaleString('ko-KR', {maximumFractionDigits: 2})
  // const amount = parseFloat(comma).toFixed(2);
  return (
      <div className="input-box">
      <input type="text" min={0} onChange={onChange} value={amount} aria-label={selectedNation}/>
        <select value={selectedNation} onChange={handleSelected}>
        {opt}
      </select>
    </div>
  );
}

export default CurrencyBox;
