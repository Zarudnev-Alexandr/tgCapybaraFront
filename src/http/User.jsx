import { API_URL } from '../globalSettings/apiUrl';

export const loginUser = async (telegram_id, tg_fio, tg_username, setIsUserLogin, setIsUserBanned) => {
  try {
    const response = await fetch(`${API_URL}users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tg_id: telegram_id, fio: tg_fio, username: tg_username })
    });

    if (response.status === 200) {
      let data = await response.json();
      setIsUserLogin(true);
      setIsUserBanned(data.is_banned);
    } else {
      setIsUserLogin(false);
    }
  } catch (error) {
    console.error(error);
    setIsUserLogin(false);
  }
};

export const getUser = async (telegram_id, tg_fio, tg_username, setIsUserLogin, setIsUserBanned) => {
  try {
    const response = await fetch(`${API_URL}users/${telegram_id}`);
    if (response.status === 200) {
      let data = await response.json();
      setIsUserBanned(data.is_banned);
      setIsUserLogin(true);

    } else if (response.status === 404) {
      await loginUser(telegram_id, tg_fio, tg_username, setIsUserLogin, setIsUserBanned);
    }
  } catch (error) {
    console.error(error);
    setIsUserLogin(false);
  }
};


export const getUserMoneyLvl = async (telegram_id, setMoney, setStartMoney, setLvl, setTimeLastUpgrade, setIsGetNft, setNftRequest) => {
  try {
    const response = await fetch(`${API_URL}users/${telegram_id}`);
    
    if (response.status === 200) {
      let data = await response.json();
      console.log(data.last_upgrade);
      setMoney(data.money);
      setStartMoney(data.money);
      setLvl(data.lvl);
      setTimeLastUpgrade(data.last_upgrade)
      setIsGetNft(data.is_get_nft)
      setNftRequest(data.nft_request)
    } 
  } catch (error) {
    console.error(error);
  }
};


export const getUserNFTLink = async (telegram_id, setNFTLink, setNFTToken) => {
  try {
    const response = await fetch(`${API_URL}users/${telegram_id}`);
    if (response.status === 200) {
      let data = await response.json();
      setNFTLink(data.nft_link);
      setNFTToken(data.nft_token);
    }
  } catch (error) {
    console.error(error);
  }
};