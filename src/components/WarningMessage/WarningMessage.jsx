import React from 'react';
import './WarningMessage.scss';

export const WarningMessage = ({is_banned}) => {
  if (is_banned){
    return (
      <div className="warning-container">
        <div className="telegram-logo">
          <img src="https://i.ytimg.com/vi/Y8wNqhjGJsw/mqdefault.jpg"></img>
        </div>
        <p className="warning-text" style={{fontSize: '20px'}}>
          Если ты жесткий драг кликер, то сорян за бан, но алгоритмы так посидели, покумекали и пришли к выводу, что ты слишком уж быстро кликаешь, подозрительно это, сам понимаешь. Сорян, тут уж ничего не сделаешь, разве что обратиться к админу.
        </p>
        <p className="bot-link">
          <strong>Ссылка на админа:</strong> <a href="https://t.me/Zarudnev_Alexandr">https://t.me/Zarudnev_Alexandr</a>
        </p>
      </div>
    );
  }else{
    return (
      <div className="warning-container">
        <div className="telegram-logo">
          <img src="https://telegram.org/img/t_logo.png"></img>
        </div>
        <p className="warning-text">
          Пожалуйста, войдите только через Telegram для корректной работы.
        </p>
        <p className="bot-link">
          <strong>Ссылка на бота:</strong> <a href="https://t.me/moodClickerBot">https://t.me/moodClickerBot</a>
        </p>
        {/* <div className="qr-code">
        <img src="http://qrcoder.ru/code/?https%3A%2F%2Ft.me%2FmoodClickerBot&4&0"></img>
      </div> */}
      </div>
    );
  }
};