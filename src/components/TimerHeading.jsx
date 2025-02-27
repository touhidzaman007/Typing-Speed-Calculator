import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import SpeedChecker from './SpeedChecker';

const TimerHeading = ({ heading }) => {
  const paragraphs = useMemo(
    () => [
      'A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot. The shoot consists of stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.',
    ],
    [],
  );

  const [maxTime, setMaxTime] = useState(1);
  const [typingText, setTypingText] = useState('');
  const [inpFieldValue, setInpFieldValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);

  const loadParagraph = useCallback(() => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        style={{
          color: letter !== ' ' ? 'black' : 'transparent',
        }}
        className={`char ${index === 0 ? 'active' : ''}`}
      >
        {letter !== ' ' ? letter : '_'}
      </span>
    ));
    setTypingText(content);
    setInpFieldValue('');
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
  }, [paragraphs]);

  const handleStartBtn = () => {
    resetGame();
  };

  const initTyping = event => {
    const value = event.target.value;
    setInpFieldValue(value);
    const typedChar = value.slice(-1);
    const characters = document.querySelectorAll('.char');
    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].innerText;
      if (currentChar === '_') currentChar = ' ';
      if (!isTyping) {
        setIsTyping(true);
      }
      if (typedChar === currentChar) {
        setCharIndex(charIndex + 1);
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add('active');
        characters[charIndex].classList.remove('active');
        characters[charIndex].classList.add('correct');
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
        characters[charIndex].classList.remove('active');
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add('active');
        characters[charIndex].classList.add('wrong');
      }
      if (charIndex === characters.length - 1) setIsTyping(false);
    }
  };

  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(maxTime * 60); // Set time left in seconds
    setCharIndex(0);
    setMistakes(0);
    setTypingText('');
    setCPM(0);
    setWPM(0);
    const characters = document.querySelectorAll('.char');
    characters.forEach(span => {
      span.classList.remove('correct');
      span.classList.remove('wrong');
      span.classList.remove('active');
    });
    characters[0].classList.add('active');
    loadParagraph();
  };
  useEffect(() => {
    loadParagraph();
  }, [loadParagraph]);

  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsTyping(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTyping, timeLeft]);

  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      const timePassed = maxTime * 60 - timeLeft;
      if (timePassed > 0) {
        const cpm = Math.floor((charIndex - mistakes) * (60 / timePassed));
        const wpm = Math.round(
          ((charIndex - mistakes) / 5) * (60 / timePassed),
        );
        setCPM(cpm < 0 ? 0 : cpm);
        setWPM(wpm < 0 ? 0 : wpm);
      }
    }
  }, [charIndex, mistakes, timeLeft, isTyping, maxTime]);

  const handleTimer = e => {
    setMaxTime(e.target.value);
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='w-full flex items-center justify-between mb-4'>
        <h1 className='text-3xl text-black font-bold'>{heading}</h1>
        <div className='flex justify-between items-center gap-4'>
          <div>
            <form className='max-w-sm mx-auto'>
              <select
                id='countries'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                value={maxTime}
                onChange={handleTimer}
              >
                <option value='1'>1 Minute</option>
                <option value='2'>2 Minutes</option>
                <option value='5'>5 Minutes</option>
              </select>
            </form>
          </div>
          <button
            className='text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5'
            onClick={handleStartBtn}
          >
            Start
          </button>
        </div>
      </div>
      <div className='w-full flex items-center justify-center mb-4'>
        <h2 className='text-2xl'>
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </h2>
      </div>
      <div className='w-full rounded-full p-3 bg-gray-100 mb-4'>
        <p className='p-2 char'>{typingText}</p>
      </div>
      <div className='w-full bg-white mb-4'>
        <textarea
          id='message'
          rows='10'
          className='input-field block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Click start to begin the test'
          value={inpFieldValue}
          onChange={initTyping}
        ></textarea>
      </div>
      <SpeedChecker mistakes={mistakes} WPM={WPM} CPM={CPM} />
    </div>
  );
};
TimerHeading.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default TimerHeading;
