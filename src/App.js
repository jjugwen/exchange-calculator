import React, { useCallback, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import instance from "./API/instance";
import CurrencyBox from "./components/CurrencyBox";
import Spinner from "./components/Spinner";
import { dark, light } from "./styles/theme";
import { useTheme } from "./styles/useTheme";

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
      const regex = /[^0-9.]+/g;
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
      setInputMoney(false);
    }
  };

  const rateDB = useCallback(async () => {
    try {
      const response = await instance.post(
        `/api?from=${currencyCodeFrom}&to=${currencyCodeTo}`
      );
      setRate(response.data.exchangeRate);
      setDate(response.data.date);
    } catch (error) {
      console.log(error);
    }
  }, [currencyCodeFrom, currencyCodeTo]);

  const currencynNationDB = async () => {
    try {
      const response = await instance.get(`/currencynationlist`);
      const listData = Object.values(response.data);
      setData(listData);
      const nations = listData
        .map((v) => `${v.nation} ${v.currencyName}`)
        .sort();
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
  }, [rateDB]);

  const [themeMode, toggleTheme] = useTheme(); // hook 함수 하용
  const theme = themeMode === "light" ? light : dark; // 테마 환경에 맞는 테마 컬러 가져오기.

  return (
    <ThemeProvider theme={theme}>
      <Background>
        <MainBox>
          <ThemeButton
            title={
              theme === "light"
                ? "일반모드로 테마 변경하기"
                : "다크모드로 테마 변경하기"
            }
            onClick={toggleTheme}
          >
            Theme
          </ThemeButton>
          <header>
            <h1>환전 계산기</h1>
            {!rate ? <Spinner /> : null}
            <p>{date}</p>
          </header>
          <CurrencyBoxStyle>
            <CurrencyBox
              name="input1"
              opt={opt}
              selectedNation={nationFrom}
              handleSelected={handleSelected1}
              money={amount1}
              onChange={onChange1}
              theme={theme}
            />
            <CurrencyBox
              name="input2"
              opt={opt}
              selectedNation={nationTo}
              handleSelected={handleSelected2}
              money={amount2}
              onChange={onChange2}
              theme={theme}
            />
          </CurrencyBoxStyle>
        </MainBox>
        <Ref>
          환율 기준 참고 API:{" "}
          <a
            href="https://exchangerate.host/#/#docs"
            style={{ color: "gray" }}
            target="_blank"
            rel="noreferrer"
          >
            https://exchangerate.host/#/#docs
          </a>
        </Ref>
      </Background>
    </ThemeProvider>
  );
}

const Background = styled.div`
  /* background-color: var(--background-color); */
  /* color: var(--primary-color); */
  background-color: ${(props) => props.theme.colors.bgColor};
  color: ${(props) => props.theme.colors.titleColor};
`;

const MainBox = styled.div`
  margin: 10% 10% 0 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2%;
  box-shadow: 13px 13px 15px rgb(160, 179, 135);
`

const ThemeButton = styled.button`
  border: none;
  border-radius: 20%;
  width: 60px;
  height: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.buttonColor.titleColor};
  background-color: ${(props) => props.theme.buttonColor.bgColor};
  
`

const CurrencyBoxStyle = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  & input {
    position: block;
    width: 223px;
    height: 40px;
    padding: 1px 6px 1px 12px;
    font-size: 16px;
    text-decoration: none solid rgt(77, 81, 86);
    text-align: left;
    border: 1px solid grey;
    border-radius: 10px;
    background: transparent;
    overflow: hidden;
    cursor: text;
    line-height: 40px;
    color: ${(props) => props.theme.colors.titleColor};
  }

  & select {
    font-size: 15px;
    line-height: 40px;
    word-spacing: 0px;
    height: 40px;
    width: 130px;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    border: 0;
    border-left: 0.5px solid rgb(235, 235, 235);
    position: absolute;
    left: 110px;
    display: block;
    z-index: 1;
    cursor: default;
    outline: 0;
    color: ${(props) => props.theme.colors.titleColor};
    background-color: ${(props) => props.theme.colors.bgColor};
  }

  & select:focus {
    background-color: ${(props) => props.theme.colors.focusColor};
  }
`;

const Ref = styled.p`
  margin-right: 10%;
  overflow: hidden;
  text-align: right;
  font-size: smaller;
  color: ${(props) => props.theme.colors.refColor};
  opacity: 60%;
`;

export default App;
