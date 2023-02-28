import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyBox from "./components/CurrencyBox";

function App() {
  const [date, setDate] = useState("");
  const [list, setList] = useState([]);
  const [rate, setRate] = useState();
  const [money, setMoney] = useState(1);
  const [inputMoney, setInputMoney] = useState(true);
  const [currency1, setCurrency1] = useState("USD"); //from
  const [currency2, setCurrency2] = useState("KRW"); //to
  const [nation1, setNation1] = useState("United States Dollar");
  const [nation2, setNation2] = useState("South Korean Won");

  let amount1, amount2;
  if (inputMoney) {
    amount1 = money;
    amount2 = money * rate;
  } else {
    amount2 = money;
    amount1 = money / rate;
  }

  const onChange1 = (e) => {
    const str = e.target.value;
    if (isNaN(str)) {
      setMoney(0);
    } else {
      const regex = /[^0-9.]+{0, 16}/g;
      const money = str.replace(regex, "");
      setMoney(money);
      setInputMoney(true);
    }
  };

  const onChange2 = (e) => {
    const str = e.target.value;
    if (isNaN(str)) {
      setMoney(0);
    } else {
      const regex = /[^0-9.]+/g;
      const money = str.replace(regex, "");
      setMoney(money);
      // setMoney(e.target.value);
      setInputMoney(false);
    }
  };

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

  const nationAPI = () => {
    const requestURL = "https://api.exchangerate.host/symbols";
    const request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();

    request.onload = function () {
      const response = request.response;
      // console.log(response.symbols)
      const data = Object.values(response.symbols);
      // const currencyCode = Object.values(response.symbols).map(k=> k.code);
      for (let value of data) {
        if (value.code === currency1) {
          setNation1(value.description);
        } else if (value.code === currency2) {
          setNation2(value.description);
        }
      }
      // const nation = Object.values(response.symbols).map(k=> k.description);
      // console.log(currencyCode, nation);
      // setList(currencyCode)
    };
  };

  const API = () => {
    const requestURL = `https://api.exchangerate.host/convert?from=${currency1}&to=${currency2}&amount=${money}`;
    const request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();

    request.onload = function () {
      const response = request.response;
      const exchangeRate = response.info.rate;
      setRate(exchangeRate);
    };
  };

  const opt = list.map((v) => (
    <option value={v} key={v}>
      {v}
    </option>
  ));

  const handleSelected1 = (e) => {
    setCurrency1(e.target.value);
  };
  const handleSelected2 = (e) => {
    setCurrency2(e.target.value);
  };

  useEffect(() => {
    API();
    listAPI();
    nationAPI();
  }, [money, currency1, currency2]);

  return (
    <div className="wrap">
      <header>
        <h1>환전 계산기</h1>
        <p>{date}</p>
      </header>
      <div className="currency-box">
        <CurrencyBox
          name="input1"
          opt={opt}
          selectedCurrency={currency1}
          handleSelected={handleSelected1}
          money={amount1}
          onChange={onChange1}
          nation={nation1}
        />
        <CurrencyBox
          name="input2"
          opt={opt}
          selectedCurrency={currency2}
          handleSelected={handleSelected2}
          money={amount2}
          onChange={onChange2}
          nation={nation2}
        />
      </div>
    </div>
  );
}

export default App;