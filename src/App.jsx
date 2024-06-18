import React, { useEffect, useState } from 'react';
import './App.css';
import { useTelegram } from './components/hooks/useTelegram';
import { getUser, loginUser } from './http/User';
import { useInterface } from './components/hooks/useInteface';
import { MainProvider } from './components/hooks/useStats_main';
import { WarningMessage } from './components/WarningMessage/WarningMessage';
import { MusicDisk } from './components/MusicDisk/MusicDisk';
import profileImg from './media/images/capybaraProfile.png';
import preloaderImg from './media/images/capybaraPreloader.png';
import { Upgrade } from './components/Upgrade/Upgrade';
import { Lk } from './components/Lk/Lk';

function App() {
  const { tg, telegram_id, setIsUserLogin, isUserLogin, setIsUserBanned, tg_fio, tg_username } = useTelegram();
  const { currentPage, setCurrentPage } = useInterface();
  const [isWelcomeScreenShown, setIsWelcomeScreenShown] = useState(true); // Show welcome screen initially

  useEffect(() => {
    tg.ready();
    // if (!tg.platform.includes("mobile")) {
    //   alert("Приложение доступно только на мобильных устройствах");
    //   window.Telegram.WebApp.close(); // Закрыть веб-приложение
    // }
    if (telegram_id) {
      getUser(telegram_id, tg_fio, tg_username, setIsUserLogin, setIsUserBanned);
    }
  }, [telegram_id]);

  const WelcomeScreen = ({ onNext }) => {
    return (
      <div className="welcome-screen">
        <div className="welcome-container">
          <img src={preloaderImg} className="preloader-img" style={{ width: '200px', borderRadius: '50%', marginBottom: '20px' }} />
          <h1>Добро пожаловать!</h1>
          <p>Рады тебя видеть🔥</p>
          <button onClick={onNext}>Начнем</button>
        </div>
      </div>
    );
  };

  const handleWelcomeNext = () => {
    setIsWelcomeScreenShown(false); // Hide welcome screen
  };

  return (
    <MainProvider>
      {isWelcomeScreenShown ? (
        <WelcomeScreen onNext={handleWelcomeNext} />
      ) : (
        isUserLogin ? (
          <>
            {currentPage === 'main' ? (
              <div className="App">
                <div className="container">
                  <div className="clicker__wrapper">
                    <div className="top-box">
                      <div className="userinfo-box" onClick={() => setCurrentPage('lk')}>
                        <img src={profileImg} className="profile-image" />
                        <h4 className="userinfo-box__fio">{tg_fio}</h4>
                      </div>
                    </div>
                    <MusicDisk />
                    <Upgrade />
                  </div>
                </div>
              </div>
            ) : <></>}
            {currentPage === 'lk' ? (
              <div style={{ 'marginTop': '10px', 'marginLeft': '15px' }}>
                <button className="back-button" onClick={() => setCurrentPage('main')}>←</button>
                <Lk />
              </div>
            ) : <></>}
          </>
        ) : (
          <div className="loader-screen">
            <div className="container">
            </div>
          </div>
        )
      )}
    </MainProvider>
  );
}

export default App;
