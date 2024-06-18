import { useContext, useEffect, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import './Lk.scss';
import { main_context } from '../hooks/useStats_main';
import profileImg from '../../media/images/capybaraProfile.png';
import { getUserNFTLink } from '../../http/User';
import { useInterface } from '../hooks/useInteface';

export let Lk = () => {
  const { tg_fio, tg_username, telegram_id } = useTelegram();
  const { setCurrentPage } = useInterface();
  const { money, setMoney, lvl, setLvl, setStartMoney, timeLastUpgrade, setTimeLastUpgrade, is_get_nft, nft_request, setIsGetNft, setNftRequest } = useContext(main_context);

  let [nft_link, setNFTLink] = useState('');
  let [nft_token, setNFTToken] = useState('');

  useEffect(() => {
    getUserNFTLink(telegram_id, setNFTLink, setNFTToken);
  }, [telegram_id]);

  return (
    <div className="lk-container">
      {/* <button className="back-button" onClick={() => setCurrentPage('main')}>Back</button> */}
      <div className="profile-block">
        <img src={profileImg} alt="Profile" className="profile-img" />
        <div className="profile-info">
          <h2>{tg_fio}</h2>
          <h3>@{tg_username}</h3>
          {nft_token && (
            <div className="profile-token">
              <span>Token: {nft_token}</span>
            </div>
          )}
          <div className="profile-links">
            {nft_link && (
              <a href={nft_link} target="_blank" rel="noopener noreferrer">View NFT</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
