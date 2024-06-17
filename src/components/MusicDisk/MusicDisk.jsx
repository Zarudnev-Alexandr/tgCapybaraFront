import React, { useState, useEffect, useRef, useContext } from 'react';
import { API_URL } from '../../globalSettings/apiUrl';
import './MusicDisk.scss';
import { useTelegram } from '../hooks/useTelegram';
import { getUser } from '../../http/User';
import { main_context } from '../hooks/useStats_main';

// Import all 44 images
const diskImages = Array.from({ length: 44 }, (_, i) => require(`../../media/images/${i + 1}.jpg`));

// const musicFiles = Array.from({ length: 18 }, (_, i) => require(`../../media/music/${i + 1}.mp3`));
const musicFiles = [
  require('../../media/music/52.mp3'),
  // require('../../media/music/2.mp3'),
  // Add all your tracks here
];

export const MusicDisk = () => {
  const { telegram_id } = useTelegram();
  const { money, startMoney, setStartMoney, setMoney } = useContext(main_context);

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentDiskImage, setCurrentDiskImage] = useState(diskImages[Math.floor(Math.random() * diskImages.length)]);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const getNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicFiles.length);
  };

  const getPreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicFiles.length) % musicFiles.length);
  };

  const handleStart = () => {
    setIsPlaying(true);
    audioRef.current.play();
    startTimeRef.current = Date.now();
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime);
      setMoney(prevMoney => prevMoney + (1 / 6000)); // Update money every 10ms as 0.001
    }, 10); // Update the timer every 10ms
  };

  const handleEnd = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    clearInterval(intervalRef.current);

    setTime(0);

    const moneyToSend = parseFloat((money - startMoney).toFixed(2));
    setStartMoney(money); // Update startMoney to the current money

    console.log(moneyToSend);

    if (moneyToSend !== 0) {
      fetch(`${API_URL}users/increment_money/${telegram_id}/${moneyToSend}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => console.log('Money updated:', data))
        .catch(error => console.error('Error updating money:', error));
    }
  };

  const handleTrackEnd = () => {
    if (isPlaying) {
      setIsPlaying(false);
      getNextTrack();
      audioRef.current.src = musicFiles[currentTrackIndex];
      audioRef.current.addEventListener('canplay', handleCanPlay);
    }
  };

  const handleCanPlay = () => {
    audioRef.current.play();
    audioRef.current.removeEventListener('canplay', handleCanPlay);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    audioElement.addEventListener('ended', handleTrackEnd);

    return () => {
      audioElement.removeEventListener('ended', handleTrackEnd);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicFiles[currentTrackIndex];
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  // Format time into hours, minutes, seconds, and milliseconds
  const formatTime = (time) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  };

  // Format money to show two decimal places
  const formatMoney = (money) => {
    return money.toFixed(2);
  };

  return (
    <div className="music-disk-container">
      <div className="money-display">💰{formatMoney(money)}</div>
      <div className="divider"></div>
      <div className="disk-space">
        <div className={`glow ${isPlaying ? 'active' : ''}`}></div>
        <div
          className={`disk ${isPlaying ? 'spinning' : ''}`}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        >
          <img src={currentDiskImage} alt="Music Disk" className="disk-image" />
        </div>
      </div>
      <audio ref={audioRef} src={musicFiles[currentTrackIndex]} />
      <div className={`controls-timer ${isPlaying ? 'playing' : ''}`}>
        <div className="timer">
          {formatTime(time)}
        </div>
        <div className={`controls ${isPlaying ? 'playing' : ''}`}>
          <button className="control-button" onClick={getPreviousTrack}>⏮️</button>
          <button className="control-button" onClick={getNextTrack}>⏭️</button>
        </div>
      </div>
    </div>
  );
};
