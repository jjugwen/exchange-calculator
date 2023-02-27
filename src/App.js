import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [money, setMoney] = useState(1);
  const [list, setList] = useState([]);
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("KRW");
  const [date, setDate] = useState("");
  // console.log(list)
  const opt = list.map((v) => (
    <option value={v} key={v}>
      {v}
    </option>
  ));
  const onChange = (e) => {
    setMoney(e.target.value);
  };
  // console.log(money)
  console.log("1번째 통화", currency1, "2번째 통화", currency2);

  useEffect(() => {
    API();
    listAPI();
  }, [money, currency1, currency2]);

  const listAPI = () => {
    const currency = "USD";
    const requestURL = `https://api.exchangerate.host/latest?base=${currency}`;
    const request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();

    request.onload = function () {
      const response = request.response;
      setDate(response.date);
      const currencyList = Object.keys(response.rates);
      setList(currencyList);
    };
  };
  const API = () => {
    console.log(currency1);
    const requestURL = `https://api.exchangerate.host/convert?from=${currency1}&to=${currency2}&amount=${money}`;
    const request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();

    request.onload = function () {
      const response = request.response.result;
      setResultMoney(response.toFixed(2)); //소수점 2째자리까지. 3째자리에서 반올림
      // console.log(response.toFixed(3))
    };
  };
  const [resultMoney, setResultMoney] = useState();
  console.log(resultMoney);

  const handleSelected = (e) => {
    setCurrency1(e.target.value);
  };
  const handleSelected2 = (e) => {
    setCurrency2(e.target.value);
  };
  return (
    <div className="wrap">
      <header>
        <h1>환전 계산기</h1>
        <p>{date}</p>
      </header>
      <div>
        <div className="currency-box">
          <input type="number" onChange={onChange} value={money} />
          <select
            name="firstCurrency"
            value={currency1}
            onChange={handleSelected}
          >
            {opt}
          </select>
        </div>
        {/* 두번째 input */}
        <div className="currency-box">
          <input defaultValue={resultMoney}/>
          <select
            name="secondCurrency"
            value={currency2}
            onChange={handleSelected2}
          >
            {opt}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
