import React, { createContext, useState, useRef, useEffect } from "react";
import { useTelegram } from "./useTelegram";
import { useInterface } from "./useInteface";
import { getUserMoneyLvl } from "../../http/User";

export const main_context = createContext();

export const MainProvider = ({ children }) => {

  const { telegram_id } = useTelegram()

  let [money, setMoney] = useState(0);
  let [startMoney, setStartMoney] = useState(0);
  let [lvl, setLvl] = useState(1);
  let [timeLastUpgrade, setTimeLastUpgrade] = useState(0);
  let [is_get_nft, setIsGetNft] = useState(false);  
  let [nft_request, setNftRequest] = useState(false);

  useEffect(() => {
    getUserMoneyLvl(telegram_id, setMoney, setStartMoney, setLvl, setTimeLastUpgrade, setIsGetNft, setNftRequest);
  }, [telegram_id]);


  return (
    <main_context.Provider
      value={{
        money,
        startMoney,
        lvl,
        timeLastUpgrade,
        is_get_nft,
        nft_request,
        setMoney,
        setStartMoney,
        setLvl,
        setTimeLastUpgrade,
        setIsGetNft,
        setNftRequest
      }}
    >
      {children}
    </main_context.Provider>
  );
};