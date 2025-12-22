// components/InteractivePresentation.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './InteractivePresentation.css';

const InteractivePresentation = () => {
  // State variables
  const [isStarted, setIsStarted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Refs
  const startPosX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const autoRotateInterval = useRef(null);
  const audioRef = useRef(null);
  const swipeContainerRef = useRef(null);
  const contentAreaRef = useRef(null);
  
  const totalSlides = 14;
  
  // Presentation data with FIXED image paths (use relative paths from public folder)
  const slides = [
    {
      id: 1,
      type: 'image',
      image: '/assets/1.jpeg', // FIXED: Changed to absolute path from public folder
      title: 'First get in touch',
      text: "I didn't know that this conversation would become a place of comfort, trust, and quiet happiness. Over time, your words, your kindness, and your presence made this connection something meaningful to me."
    },
    {
      id: 2,
      type: 'image',
      image: '/assets/2d.jpeg', // FIXED: Changed to absolute path from public folder
      title: 'Before the world knew, you did.',
      text: 'When I received my first professional opportunity — my CIVP contract — you were the first person I wanted to tell, right after my parents. Not because it was an announcement, but because trust chooses quietly.'
    },
    {
      id: 3,
      type: 'image',
      image: '/assets/3.jpeg', // FIXED: Changed to absolute path from public folder
      title: 'Every journey feels lighter when someone cares.',
      text: 'Before Algeria, before the roads and plans, there was you — advising, reminding, and looking out for me. It wasn\'t about the trip itself, but about knowing someone was thinking of me along the way. That kind of care stays.'
    },
    {
      id: 4,
      type: 'image',
      image: '/assets/4.jpeg', // FIXED: Changed to absolute path from public folder
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

  // FIXED: Improved resize handler with debounce
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
        
        if (swipeContainerRef.current) {
          const slideWidth = swipeContainerRef.current.clientWidth / totalSlides;
          prevTranslate.current = -currentItemIndex * slideWidth;
          currentTranslate.current = prevTranslate.current;
          swipeContainerRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [currentItemIndex, totalSlides]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
    
    return () => {
      stopAutoRotation();
    };
  }, []);

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
      if (windowSize.width <= 768) {
        setTimeout(() => {
          const hint = document.getElementById('swipe-hint');
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
          if (windowSize.width <= 768) {
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

  // Touch handlers with improved mobile detection
  const handleTouchStart = (e) => {
    startPosX.current = e.touches[0].clientX;
    setIsDragging(true);
    resetAutoRotation();
    
    // Prevent scrolling while swiping
    document.body.style.overflow = 'hidden';
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
    
    // Restore scrolling
    document.body.style.overflow = '';
    
    const movedBy = currentTranslate.current - prevTranslate.current;
    const swipeThreshold = windowSize.width <= 768 ? 50 : 100; // Lower threshold for mobile
    
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
    <div className="interactive-presentation">
      <div className="cinema-overlay"></div>
      <div className="spotlight"></div>
      
      <div className="container">
        {!isStarted ? (
          <button 
            className={`init-btn ${isStarted ? 'hidden' : ''}`}
            onClick={startPresentation}
          >
            <span role="img" aria-label="play" className="play-icon">▶️</span> 
            <span className="btn-text">Click here</span>
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
                        onError={(e) => {
                          console.error(`Failed to load image: ${slide.image}`);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="image-placeholder">
                              <span>Image not found</span>
                              <br/>
                              <small>Place image at: public${slide.image}</small>
                            </div>
                          `;
                        }}
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
              <span role="img" aria-label="left" className="hint-icon">◀️</span>
              Swipe to navigate 
              <span role="img" aria-label="right" className="hint-icon">▶️</span>
            </div>
          </div>
        )}
      </div>
      
      {isStarted && (
        <>
          <div className="music-info">
            <span role="img" aria-label="music" className="music-icon">🎵</span> Background music
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
        <source src="../../assets/m.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default InteractivePresentation;