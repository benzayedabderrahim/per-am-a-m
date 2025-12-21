// components/InteractivePresentation.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractivePresentation = () => {
  // State variables
  const [isStarted, setIsStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const startPosX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const autoRotateInterval = useRef(null);
  const audioRef = useRef(null);
  const swipeContainerRef = useRef(null);
  const contentAreaRef = useRef(null);
  
  const totalSlides = 14;
  
  // Presentation data
  const slides = [
    {
      id: 1,
      type: 'image',
      image: require('./assets/1.jpeg'),
      title: 'First get in touch',
      text: "I didn't know that this conversation would become a place of comfort, trust, and quiet happiness. Over time, your words, your kindness, and your presence made this connection something meaningful to me."
    },
    {
      id: 2,
      type: 'image',
      image: require('./assets/2d.jpeg'),
      title: 'Before the world knew, you did.',
      text: 'When I received my first professional opportunity — my CIVP contract — you were the first person I wanted to tell, right after my parents. Not because it was an announcement, but because trust chooses quietly.'
    },
    {
      id: 3,
      type: 'image',
      image: require('./assets/3.jpeg'),
      title: 'Every journey feels lighter when someone cares.',
      text: 'Before Algeria, before the roads and plans, there was you — advising, reminding, and looking out for me. It wasn\'t about the trip itself, but about knowing someone was thinking of me along the way. That kind of care stays.'
    },
    {
      id: 4,
      type: 'image',
      image: require('./assets/4.jpeg'),
      title: 'Small Moments, Big Meaning',
      text: 'It\'s in the small things — a message at the right time, a shared laugh, a moment of understanding. These fragments of connection weave into something lasting, something that feels like home.'
    },
    {
      id: 5,
      type: 'text',
      title: 'Simply, Thank You',
      text: 'For being there, for listening, for understanding without judgment. For the quiet support that never asked for anything in return. Some connections are rare — this is one of them.'
    },
    {
      id: 6,
      type: 'text',
      title: 'I would like to say ...',
      text: 'I really loved you , maybe in my own and unique way but be sure that it\'s honest and clear and not casual as many people around hahaha that we both hate them , but , I don\'t know , I just wanted to say and not to hide it anymore'
    },
    {
      id: 7,
      type: 'text',
      title: 'I chose this day , 9th January',
      text: 'Because everything started here , hahaha with a note reply , but it\'ve lead us into this storm that I really loved'
    },
    {
      id: 8,
      type: 'text',
      title: 'And now ...',
      text: 'I just want you to know that I really loved you and these moments we shared together , thanks for everything , I will be by your side as possible as I can inchallah'
    },
    {
      id: 9,
      type: 'text-only',
      title: 'You are not only special to me.'
    },
    {
      id: 10,
      type: 'text-only',
      title: 'With time, reflection, and sincerity, I realized something deeper: you are the person I choose — not for a moment, but for a path I want to walk with intention and respect'
    },
    {
      id: 11,
      type: 'text-only',
      title: 'I don\'t speak of rushed promises or perfect futures. I speak of a decision made calmly, with values, faith, and responsibility'
    },
    {
      id: 12,
      type: 'text-only',
      title: 'Inchallah , you are the one I wish to continue with — honestly, openly, and toward something meaningful'
    },
    {
      id: 13,
      type: 'text-only',
      title: 'No expectations, Only sincerity.'
    },
    {
      id: 14,
      type: 'text-only',
      title: '❤️'
    }
  ];

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
    
    return () => {
      stopAutoRotation();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Start presentation
  const startPresentation = () => {
    setIsStarted(true);
    
    setTimeout(() => {
      if (contentAreaRef.current) {
        contentAreaRef.current.classList.add('active');
      }
      
      // Play music when presentation starts
      playMusic();
      
      // Start auto rotation
      startAutoRotation();
      
      // Show swipe hint briefly on mobile
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const hint = document.querySelector('.swipe-hint');
          if (hint) {
            hint.style.display = 'block';
            setTimeout(() => {
              hint.style.display = 'none';
            }, 8000);
          }
        }, 1000);
      }
    }, 50);
  };

  // Music controls
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch(e => {
          console.log("Autoplay prevented:", e);
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              alert("Please tap the play button to start the background music.");
            }, 1000);
          }
        });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  // Navigation functions
  const goToSlide = useCallback((index) => {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    setCurrentItemIndex(index);
    if (swipeContainerRef.current) {
      const slideWidth = swipeContainerRef.current.clientWidth / totalSlides;
      prevTranslate.current = -index * slideWidth;
      currentTranslate.current = prevTranslate.current;
      
      // Animate to position
      swipeContainerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      swipeContainerRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }
    
    // Reset auto rotation
    resetAutoRotation();
  }, [totalSlides]);

  const startAutoRotation = () => {
    stopAutoRotation();
    autoRotateInterval.current = setInterval(() => {
      const nextIndex = (currentItemIndex + 1) % totalSlides;
      goToSlide(nextIndex);
    }, 10000);
  };

  const stopAutoRotation = () => {
    if (autoRotateInterval.current) {
      clearInterval(autoRotateInterval.current);
      autoRotateInterval.current = null;
    }
  };

  const resetAutoRotation = () => {
    stopAutoRotation();
    startAutoRotation();
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    startPosX.current = e.touches[0].clientX;
    setIsDragging(true);
    resetAutoRotation();
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !swipeContainerRef.current) return;
    
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPosX.current;
    currentTranslate.current = prevTranslate.current + diff;
    
    // Apply boundaries
    const maxTranslate = 0;
    const minTranslate = -swipeContainerRef.current.clientWidth * (1 - (1/totalSlides));
    currentTranslate.current = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate.current));
    
    swipeContainerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate.current - prevTranslate.current;
    const swipeThreshold = 100;
    
    if (Math.abs(movedBy) > swipeThreshold) {
      if (movedBy > 0 && currentItemIndex > 0) {
        goToSlide(currentItemIndex - 1);
      } else if (movedBy < 0 && currentItemIndex < totalSlides - 1) {
        goToSlide(currentItemIndex + 1);
      } else {
        goToSlide(currentItemIndex);
      }
    } else {
      goToSlide(currentItemIndex);
    }
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    startPosX.current = e.clientX;
    setIsDragging(true);
    if (swipeContainerRef.current) {
      swipeContainerRef.current.style.cursor = 'grabbing';
    }
    resetAutoRotation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !swipeContainerRef.current) return;
    e.preventDefault();
    
    const currentPosition = e.clientX;
    const diff = currentPosition - startPosX.current;
    currentTranslate.current = prevTranslate.current + diff;
    
    // Apply boundaries
    const maxTranslate = 0;
    const minTranslate = -swipeContainerRef.current.clientWidth * (1 - (1/totalSlides));
    currentTranslate.current = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate.current));
    
    swipeContainerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeContainerRef.current) {
      swipeContainerRef.current.style.cursor = 'grab';
    }
    
    const movedBy = currentTranslate.current - prevTranslate.current;
    const swipeThreshold = 100;
    
    if (Math.abs(movedBy) > swipeThreshold) {
      if (movedBy > 0 && currentItemIndex > 0) {
        goToSlide(currentItemIndex - 1);
      } else if (movedBy < 0 && currentItemIndex < totalSlides - 1) {
        goToSlide(currentItemIndex + 1);
      } else {
        goToSlide(currentItemIndex);
      }
    } else {
      goToSlide(currentItemIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (swipeContainerRef.current) {
        swipeContainerRef.current.style.cursor = 'grab';
      }
      goToSlide(currentItemIndex);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (swipeContainerRef.current) {
        const slideWidth = swipeContainerRef.current.clientWidth / totalSlides;
        prevTranslate.current = -currentItemIndex * slideWidth;
        currentTranslate.current = prevTranslate.current;
        swipeContainerRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentItemIndex, totalSlides]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMusicPlaying && audioRef.current) {
        audioRef.current.pause();
      } else if (!document.hidden && isMusicPlaying && isStarted && audioRef.current) {
        audioRef.current.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMusicPlaying, isStarted]);

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.5) return '🔉';
    return '🔊';
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          padding: 20px;
          overflow-x: hidden;
          touch-action: pan-y;
        }
        
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .cinema-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.9) 100%);
          z-index: 5;
          pointer-events: none;
        }
        
        .spotlight {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 4;
          pointer-events: none;
          filter: blur(20px);
        }
        
        .container {
          width: 100%;
          max-width: 900px;
          text-align: center;
          position: relative;
          height: auto;
          z-index: 6;
        }
        
        .init-btn {
          padding: 25px 70px;
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(45deg, #FF5F6D, #FFC371, #FF5F6D);
          background-size: 200% 200%;
          color: white;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 
              0 0 50px rgba(255, 95, 109, 0.6),
              0 10px 40px rgba(0, 0, 0, 0.5),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          letter-spacing: 3px;
          z-index: 10;
          animation: 
              pulseCinema 3s infinite,
              gradientShift 4s infinite alternate,
              floatEffect 6s infinite ease-in-out;
          transform-style: preserve-3d;
          perspective: 500px;
        }
        
        @keyframes pulseCinema {
          0% { 
              transform: scale(1) translateZ(0);
              box-shadow: 
                  0 0 50px rgba(255, 95, 109, 0.6),
                  0 10px 40px rgba(0, 0, 0, 0.5),
                  inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
          50% { 
              transform: scale(1.08) translateZ(20px);
              box-shadow: 
                  0 0 80px rgba(255, 95, 109, 0.9),
                  0 20px 60px rgba(0, 0, 0, 0.7),
                  inset 0 0 40px rgba(255, 255, 255, 0.5);
          }
          100% { 
              transform: scale(1) translateZ(0);
              box-shadow: 
                  0 0 50px rgba(255, 95, 109, 0.6),
                  0 10px 40px rgba(0, 0, 0, 0.5),
                  inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0) translateZ(0); }
          50% { transform: translateY(-10px) translateZ(10px); }
        }
        
        .init-btn:before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #FF5F6D, #FFC371, #FF5F6D, #FFC371);
          background-size: 400% 400%;
          z-index: -1;
          border-radius: 17px;
          animation: borderGlow 3s infinite linear;
          filter: blur(5px);
          opacity: 0.7;
        }
        
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .init-btn:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 15px;
          z-index: 1;
        }
        
        .init-btn:hover {
          transform: translateY(-5px) scale(1.05) translateZ(30px);
          animation-play-state: paused;
        }
        
        .init-btn:active {
          transform: translateY(0) scale(0.98) translateZ(10px);
          transition: all 0.1s ease;
        }
        
        .init-btn.hidden {
          opacity: 0;
          transform: scale(0.5) translateY(50px) translateZ(-100px);
          pointer-events: none;
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* Content area styling */
        .content-area {
          display: none;
          opacity: 0;
          transition: opacity 1s ease;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          overflow: hidden;
          position: relative;
          height: 75vh;
          max-height: 700px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          margin-top: 0;
          z-index: 7;
        }
        
        .content-area.active {
          display: block;
          opacity: 1;
        }
        
        /* Swipeable content container */
        .swipe-container {
          display: flex;
          width: 1400%; /* 100% * 14 slides */
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .content-item {
          width: 7.142857%; /* 100% divided by 14 slides */
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0;
          position: relative;
        }
        
        /* For slides with images */
        .content-item.has-image {
          flex-direction: column;
        }
        
        .content-item.has-image .text-container {
          height: 45%;
          justify-content: center;
        }
        
        /* For slides without images - full height text */
        .content-item:not(.has-image) .text-container {
          height: 100%;
          justify-content: center;
          padding-top: 0;
        }
        
        /* Fullscreen image styling */
        .item-image-container {
          width: 100%;
          height: 55%;
          overflow: hidden;
          position: relative;
        }
        
        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        
        /* Text content styling */
        .text-container {
          padding: 25px 30px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          text-align: center;
          width: 100%;
          height: 100%;
        }
        
        .item-title {
          font-size: 2.2rem;
          color: #1a2a6c;
          margin-bottom: 20px;
          font-weight: 700;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          line-height: 1.3;
        }
        
        .item-text {
          font-size: 1.4rem;
          line-height: 1.8;
          color: #333;
          margin-bottom: 10px;
        }
        
        /* Text-only slides styling */
        .text-only-slide .item-title {
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: #FF5F6D;
        }
        
        .text-only-slide .item-text {
          font-size: 1.6rem;
          line-height: 1.9;
          color: #444;
        }
        
        /* Swipe instruction hint */
        .swipe-hint {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          z-index: 10;
          animation: fadeInOut 3s infinite;
          display: none;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 15px;
          border-radius: 20px;
          width: fit-content;
          margin: 0 auto;
          backdrop-filter: blur(5px);
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        /* Music controls */
        .music-controls {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          gap: 15px;
          z-index: 100;
        }
        
        .music-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #1a2a6c;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .music-btn:hover {
          transform: scale(1.1);
          background: white;
        }
        
        .volume-slider {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 150px;
          transform: rotate(-90deg);
          transform-origin: right bottom;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .volume-slider.show {
          opacity: 1;
          pointer-events: all;
        }
        
        .music-info {
          position: fixed;
          bottom: 30px;
          left: 30px;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          padding: 12px 20px;
          border-radius: 30px;
          font-size: 0.9rem;
          backdrop-filter: blur(5px);
          z-index: 100;
        }
        
        /* ================= MOBILE ADJUSTMENTS ================= */
        @media (max-width: 768px) {
          body {
            padding: 10px 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          
          .cinema-overlay {
            background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.95) 100%);
          }
          
          .spotlight {
            width: 300px;
            height: 300px;
            filter: blur(15px);
          }
          
          .container {
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-height: 90vh;
          }
          
          .init-btn {
            padding: 20px 40px;
            font-size: 1.8rem;
            letter-spacing: 2px;
            width: 90%;
            max-width: 350px;
            border-radius: 12px;
          }
          
          .content-area {
            height: 70vh;
            max-height: 600px;
            border-radius: 20px;
            width: 95%;
            margin-top: 0;
            margin-bottom: 20px;
          }
          
          .item-image-container {
            height: 45%;
          }
          
          .content-item.has-image .text-container {
            height: 55%;
            padding: 15px;
          }
          
          .text-container {
            padding: 15px 20px;
          }
          
          .item-title {
            font-size: 1.6rem;
            margin-bottom: 15px;
            line-height: 1.2;
          }
          
          .item-text {
            font-size: 1.1rem;
            line-height: 1.5;
          }
          
          .text-only-slide .item-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
          }
          
          .text-only-slide .item-text {
            font-size: 1.3rem;
            line-height: 1.6;
          }
          
          .swipe-hint {
            display: block;
            bottom: 15px;
            font-size: 0.8rem;
            padding: 6px 12px;
          }
          
          .music-controls {
            bottom: 15px;
            right: 15px;
          }
          
          .music-btn {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }
          
          .music-info {
            bottom: 15px;
            left: 15px;
            padding: 8px 12px;
            font-size: 0.75rem;
            max-width: 200px;
          }
          
          .volume-slider {
            bottom: 60px;
            width: 120px;
          }
        }
        
        @media (max-width: 480px) {
          body {
            padding: 5px;
          }
          
          .spotlight {
            width: 250px;
            height: 250px;
          }
          
          .init-btn {
            padding: 18px 35px;
            font-size: 1.5rem;
            width: 85%;
            border-radius: 10px;
          }
          
          .content-area {
            height: 65vh;
            max-height: 550px;
            width: 92%;
          }
          
          .item-title {
            font-size: 1.4rem;
            margin-bottom: 12px;
          }
          
          .item-text {
            font-size: 1rem;
            line-height: 1.4;
          }
          
          .text-only-slide .item-title {
            font-size: 1.6rem;
          }
          
          .text-only-slide .item-text {
            font-size: 1.1rem;
          }
          
          .text-container {
            padding: 12px 15px;
          }
          
          .swipe-hint {
            font-size: 0.7rem;
            bottom: 10px;
            padding: 5px 10px;
          }
          
          .music-controls {
            bottom: 10px;
            right: 10px;
            gap: 10px;
          }
          
          .music-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          
          .music-info {
            bottom: 10px;
            left: 10px;
            padding: 6px 10px;
            font-size: 0.7rem;
            max-width: 180px;
          }
        }
        
        @media (max-height: 600px) and (orientation: landscape) {
          body {
            align-items: center;
            padding-top: 5px;
          }
          
          .init-btn {
            padding: 15px 30px;
            font-size: 1.4rem;
            margin-bottom: 10px;
          }
          
          .content-area {
            height: 85vh;
            max-height: none;
            margin-bottom: 10px;
          }
          
          .item-image-container {
            height: 50%;
          }
          
          .item-title {
            font-size: 1.3rem;
          }
          
          .item-text {
            font-size: 0.95rem;
          }
          
          .text-only-slide .item-title {
            font-size: 1.5rem;
          }
          
          .text-only-slide .item-text {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 360px) {
          .init-btn {
            font-size: 1.4rem;
            padding: 15px 25px;
            border-radius: 8px;
          }
          
          .content-area {
            height: 60vh;
            max-height: 500px;
          }
          
          .item-title {
            font-size: 1.3rem;
          }
          
          .item-text {
            font-size: 0.95rem;
          }
          
          .text-only-slide .item-title {
            font-size: 1.4rem;
          }
          
          .text-only-slide .item-text {
            font-size: 1rem;
          }
        }
        
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      {/* Cinema overlay effects */}
      <div className="cinema-overlay"></div>
      <div className="spotlight"></div>
      
      <div className="container">
        {!isStarted ? (
          <button 
            className={`init-btn ${isStarted ? 'hidden' : ''}`}
            onClick={startPresentation}
          >
            <span role="img" aria-label="play">▶️</span> 
            <span>Click here</span>
          </button>
        ) : (
          <div 
            className="content-area" 
            ref={contentAreaRef}
            id="content-area"
          >
            <div 
              className="swipe-container no-select"
              ref={swipeContainerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onContextMenu={(e) => e.preventDefault()}
            >
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`content-item ${
                    slide.type === 'image' ? 'has-image' : 
                    slide.type === 'text-only' ? 'text-only-slide' : ''
                  }`}
                  id={`item-${slide.id}`}
                >
                  {slide.type === 'image' && slide.image && (
                    <div className="item-image-container">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="item-image" 
                      />
                      <div className="image-overlay"></div>
                    </div>
                  )}
                  <div className="text-container">
                    <h2 className="item-title">{slide.title}</h2>
                    {slide.text && <p className="item-text">{slide.text}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="swipe-hint" id="swipe-hint">
              <span role="img" aria-label="left">◀️</span>
              Swipe to navigate 
              <span role="img" aria-label="right">▶️</span>
            </div>
          </div>
        )}
      </div>
      
      {isStarted && (
        <>
          <div className="music-info">
            <span role="img" aria-label="music">🎵</span> Background music
          </div>
          
          <div className="music-controls">
            <button className="music-btn" onClick={toggleMusic}>
              {isMusicPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="music-btn" onClick={toggleVolumeSlider}>
              {getVolumeIcon()}
            </button>
            <input 
              type="range" 
              id="volume-slider" 
              className={`volume-slider ${showVolumeSlider ? 'show' : ''}`}
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </>
      )}

      <audio 
        id="bg-music" 
        ref={audioRef}
        preload="auto"
      >
        <source src={require('./assets/m.mp3')} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default InteractivePresentation;