import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyBox from "./components/CurrencyBox";
import instance from "./API/instance";

function App() {
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [date, setDate] = useState("");
  const [rate, setRate] = useState();
  const [money, setMoney] = useState(1);
  const [inputMoney, setInputMoney] = useState(true);
  const [currencyCodeFrom, setCurrencyCodeFrom] = useState("USD"); //from
  const [currencyCodeTo, setCurrencyCodeTo] = useState("KRW"); //to
  const [nationFrom, setNationFrom] = useState("미국 달러"); //from
  const [nationTo, setNationTo] = useState("대한민국 원"); //to

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

  const rateDB = async (rate, date) => {
    try {
      const response = await instance.post(
        `/api/${currencyCodeFrom}/${currencyCodeTo}`,
        {
          rate,
          date
        },
        {
          headers: {
            "Content-Type": "*",
            withCredentials: true,
          },
        }
      );
      // console.log(response.data);
      setRate(response.data.exchangeRate);
      setDate(response.data.date);
    } catch (error) {
      console.log(error);
    }
  };

  const currencynNationDB = async (data) => {
    try {
      const response = await instance.get(`/currencynationlist`, data);
      // console.log(response.data);
      const listData = Object.values(response.data);
      setData(listData);
      // console.log(listData.map(v=> `${v.nation} ${v.currencyName}`))
      const nations = listData.map(v=> `${v.nation} ${v.currencyName}`).sort();
      // console.log(`${nations} ${currencyName}`);
      // console.log(nations);
      setList(nations);
    } catch (error) {
      console.log(error);
    }
  };

  const opt = list.map((v) => (
    <option value={v} key={v}>
      {v}
    </option>
  ));

  const handleSelected1 = (e) => {
    setNationFrom(e.target.value);
    for (let value of data) {
      const country = e.target.value.split(" ")[0];
      if (value.nation === country) {
        setCurrencyCodeFrom(value.currencyCode);
      }
    }
  };

  const handleSelected2 = (e) => {
    setNationTo(e.target.value);
    for (let value of data) {
      const country = e.target.value.split(" ")[0];
      if (value.nation === country) {
        setCurrencyCodeTo(value.currencyCode);
      }
    }
  };

  useEffect(() => {
    currencynNationDB();
    rateDB();
  }, [money, nationFrom, nationTo]);

  return (
    <>
    <div className="wrap">
      <header>
        <h1>환전 계산기</h1>
        <p>{date}</p>
      </header>
      <div className="currency-box">
        <CurrencyBox
          name="input1"
          opt={opt}
          selectedNation={nationFrom}
          handleSelected={handleSelected1}
          money={amount1}
          onChange={onChange1}
        />
        <CurrencyBox
          name="input2"
          opt={opt}
          selectedNation={nationTo}
          handleSelected={handleSelected2}
          money={amount2}
          onChange={onChange2}
        />
      </div>
      </div>
      <p className="ref">환율 기준 참고 API: <a href="https://exchangerate.host/#/#docs"  style={{color: "gray"}} target="_blank" rel="noreferrer">https://exchangerate.host/#/#docs</a></p>
    </>
  );
}

export default App;
