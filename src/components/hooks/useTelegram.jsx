import { useState } from "react";

const tg = window.Telegram.WebApp;

export function useTelegram() {

  let [isUserLogin, setIsUserLogin] = useState(false);
  let [isUserBanned, setIsUserBanned] = useState(false);

  return {
    tg,
    telegram_id: tg.initDataUnsafe?.user?.id,
    // telegram_id: 6,
    tg_fio: tg.initDataUnsafe?.user?.first_name + ' ' + tg.initDataUnsafe?.user?.last_name,
    // tg_fio: 'Александр Заруднев',
    tg_username: tg.initDataUnsafe?.user?.username,
    // tg_username: '@zxc',
    isUserBanned,
    isUserLogin,
    setIsUserLogin,
    setIsUserBanned,
  }
}