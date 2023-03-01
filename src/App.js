import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyBox from "./components/CurrencyBox";
import instance from "./API/instance";

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

  const listDB = async (date, currencylist) => {
    try {
      const response = await instance.get(`/currencylist`, {
        date,
        currencylist,
      });
      // console.log(response.data)
      setList(response.data.currencyList);
      setDate(response.data.date)
    } catch (error) {
      console.log(error);
    }
  };

  const nationDB = async (nationlist) => {
    try {
      const response = await instance.get(`/nationlist`, nationlist);
      // console.log(response.data);
      for (let value of response.data) {
        if (value.code === currency1) {
          setNation1(value.description);
        } else if (value.code === currency2) {
          setNation2(value.description);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rateDB = async (rate) => {
    try {
      const response = await instance.post(
        `/api/${currency1}/${currency2}`,
        rate,
        {
          headers: {
            "Content-Type": "*",
            withCredentials: true,
          },
        }
      );
      // console.log(response.data);
      setRate(response.data);
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
    setCurrency1(e.target.value);
  };
  const handleSelected2 = (e) => {
    setCurrency2(e.target.value);
  };

  useEffect(() => {
    listDB();
    nationDB();
    rateDB();
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
