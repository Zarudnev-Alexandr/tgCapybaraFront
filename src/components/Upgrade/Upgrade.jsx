import React, { useContext, useState, useEffect } from 'react';
import { API_URL } from '../../globalSettings/apiUrl';
import './Upgrade.scss';
import { useTelegram } from '../hooks/useTelegram';
import { main_context } from '../hooks/useStats_main';

export const Upgrade = () => {
  const { telegram_id } = useTelegram();
  const { money, setMoney, lvl, setLvl, setStartMoney, timeLastUpgrade, setTimeLastUpgrade, is_get_nft, nft_request, setIsGetNft, setNftRequest } = useContext(main_context);
  const [isMaxLevel, setIsMaxLevel] = useState(false);
  const [upgradeCost, setUpgradeCost] = useState(15); // Assuming the cost is fixed at 15 for every upgrade
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (lvl >= 7) {
      setIsMaxLevel(true);
    }

    if (timeLastUpgrade) {
      const lastUpgradeTime = new Date(timeLastUpgrade);
      const currentTime = new Date();
      const timeDifference = currentTime - lastUpgradeTime;
      const oneDayInMillis = 24 * 60 * 60 * 1000;

      if (timeDifference < oneDayInMillis) {
        setTimeRemaining(oneDayInMillis - timeDifference);
      }
    }
  }, [lvl, timeLastUpgrade]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            return null;
          }
          return prevTime - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const handleUpgrade = () => {
    if (isMaxLevel || money < upgradeCost || timeRemaining > 0) return;

    fetch(`${API_URL}users/upgrade/${telegram_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Пользователь не найден");
          } else if (response.status === 401) {
            throw new Error("Не хватает денег");
          } else if (response.status === 400) {
            throw new Error("Максимальный уровень");
          } else if (response.status === 403) {
            throw new Error("Пользователь забанен или слишком часто кликает");
          }
          throw new Error("Ошибка обновления уровня");
        }
        return response.json();
      })
      .then(data => {
        setLvl(data.lvl);
        setMoney(prevMoney => prevMoney - upgradeCost);
        setStartMoney(prevMoney => prevMoney - upgradeCost);
        setTimeLastUpgrade(new Date().toISOString());
        if (data.lvl >= 7) {
          setIsMaxLevel(true);
        }
        setTimeRemaining(24 * 60 * 60 * 1000); // Reset the timer for the next upgrade
        setIsGetNft(data.is_get_nft);
        setNftRequest(data.nft_request);
      })
      .catch(error => console.error('Error upgrading level:', error.message));
  };

  const handleNftRequest = () => {
    fetch(`${API_URL}users/nft_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tg_id: telegram_id, wallet: walletAddress }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка подачи заявки на получение NFT");
        }
        return response.json();
      })
      .then(data => {
        setNftRequest(true);
      })
      .catch(error => console.error('Error requesting NFT:', error.message));
  };

  const progressPercentage = (lvl / 7) * 100;
  const formattedMoney = money.toFixed(2);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={`upgrade-bar ${isMaxLevel ? 'max-level' : ''}`} onClick={isMaxLevel ? undefined : handleUpgrade}>
      {!isMaxLevel &&
        <div className="level-info">
          Level: {lvl}
        </div>
      }
      {isMaxLevel ? (
        is_get_nft ? (
          <span className="nft-status">NFT получено! зайдите в личный кабинет</span>
        ) : nft_request ? (
          <span className="nft-status">Заявка обрабатывается</span>
        ) : (
          <div className="nft-request">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Введите адрес кошелька"
              className="wallet-input"
            />
            <button onClick={handleNftRequest} className="send-button">→</button>
          </div>
        )
      ) : (
        <>
          {timeRemaining <= 0 &&
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          }
          <div className="cost-info">
            {timeRemaining > 0 ? (
              <span>Next upgrade in: {formatTime(timeRemaining)}</span>
            ) : money >= upgradeCost ? (
              <span>Upgrade <span className="arrow">↑</span></span>
            ) : (
              <span>{formattedMoney}/{upgradeCost.toFixed(1)}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
