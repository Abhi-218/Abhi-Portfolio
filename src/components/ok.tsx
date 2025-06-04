'use client';

import { useState, useEffect, useRef } from 'react';
import useSoundPlayer from '@/hooks/useSoundPlayer';

// Attention-seeking specific emojis and texts
const attentionSeekingEmojis = [
  { emoji: '👋', text: "Hey! Look at me!" },
  { emoji: '🎭', text: "Notice me!" },
  { emoji: '✨', text: "Over here!" },
  { emoji: '🌟', text: "I'm getting lonely..." },
  { emoji: '🔔', text: "Hello! Anyone there?" },
  { emoji: '💫', text: "Don't ignore me!" },
  { emoji: '🎪', text: "Wanna play?" },
  { emoji: '🎯', text: "Click me!" },
  { emoji: '🧩', text: "I'm bored..." },
  { emoji: '🎨', text: "Let's have fun!" }
];

// Define the emoji states with progressively "angrier" moods
const emojiStates = [
  // Level 0: Playful/Friendly
  { 
    options: [
      { emoji: '😊', text: 'Try to catch me!' },
      { emoji: '😄', text: 'Come and play!' },
      { emoji: '🤗', text: 'Hello there!' },
      { emoji: '😁', text: 'Catch me if you can!' },
      { emoji: '😉', text: 'Too slow!' }
    ],
    teasingTexts: [
      "Almost got me!",
      "Not even close!",
      "You're too slow!",
      "Keep trying!",
      "Missed me!"
    ]
  },
  // Level 1: Mischievous
  { 
    options: [
      { emoji: '😏', text: 'Nice try!' },
      { emoji: '🙃', text: 'Still trying?' },
      { emoji: '😜', text: 'Too predictable!' },
      { emoji: '😝', text: 'Missed again!' },
      { emoji: '😋', text: 'Better luck next time!' }
    ],
    teasingTexts: [
      "You'll never catch me!",
      "Are you even trying?",
      "I can do this all day!",
      "So predictable!",
      "Better luck next time!"
    ]
  },
  // Level 2: Annoyed
  { 
    options: [
      { emoji: '😒', text: 'Getting annoying now...' },
      { emoji: '🙄', text: 'Seriously?' },
      { emoji: '😑', text: 'Will you stop?' },
      { emoji: '😐', text: 'This is getting old!' },
      { emoji: '😕', text: 'I\'m losing patience!' }
    ],
    teasingTexts: [
      "Don't you have anything better to do?",
      "I'm getting tired of this!",
      "Can you please stop?",
      "This is getting annoying!",
      "Last warning!"
    ]
  },
  // Level 3: Irritated
  { 
    options: [
      { emoji: '😠', text: "I'm getting annoyed!" },
      { emoji: '😤', text: "That's enough!" },
      { emoji: '👿', text: "I'm warning you!" },
      { emoji: '💢', text: "You're testing me!" },
      { emoji: '😡', text: "I'm losing it!" }
    ],
    teasingTexts: [
      "You're really pushing it!",
      "I'm about to lose my temper!",
      "You don't want to see me angry!",
      "Last chance to stop!",
      "I'm warning you!"
    ]
  },
  // Level 4: Angry
  { 
    options: [
      { emoji: '🤬', text: "That's it!" },
      { emoji: '💥', text: "You asked for it!" },
      { emoji: '👹', text: "Now I'm mad!" },
      { emoji: '😡', text: "You've done it now!" },
      { emoji: '👺', text: "Prepare for chaos!" }
    ],
    teasingTexts: [
      "You brought this on yourself!",
      "Time for payback!",
      "Watch what happens now!",
      "Chaos incoming!",
      "You shouldn't have done that!"
    ]
  },
  // Level 5: Rage mode
  { 
    options: [
      { emoji: '🌋', text: "TOTAL MELTDOWN!" },
      { emoji: '☢️', text: "SYSTEM CRITICAL!" },
      { emoji: '🔥', text: "RAGE MODE ACTIVATED!" },
      { emoji: '💀', text: "GAME OVER FOR YOU!" },
      { emoji: '⚡', text: "MAXIMUM FURY!" }
    ],
    teasingTexts: [
      "WITNESS TRUE CHAOS!",
      "YOU BROUGHT THIS ON YOURSELF!",
      "TOTAL WEBSITE DESTRUCTION!",
      "EVERYTHING BURNS!",
      "THERE'S NO ESCAPE NOW!"
    ]
  }
];

// Define website effects for anger levels with durations
const websiteEffects = [
  { // Level 0: No effect
    applyEffect: () => {},
    removeEffect: () => {},
    duration: 0
  },
  { // Level 1: Mild effects
    applyEffect: () => {
      document.body.style.filter = 'hue-rotate(15deg)';
      document.body.style.transition = 'filter 0.5s ease';
    },
    removeEffect: () => {
      document.body.style.filter = '';
      document.body.style.transition = '';
    },
    duration: 5000
  },
  { // Level 2: More noticeable
    applyEffect: () => {
      document.body.style.filter = 'hue-rotate(45deg)';
      document.body.style.transform = 'rotate(1deg)';
      document.body.style.transition = 'all 0.5s ease';
    },
    removeEffect: () => {
      document.body.style.filter = '';
      document.body.style.transform = '';
      document.body.style.transition = '';
    },
    duration: 6000
  },
  { // Level 3: Disruptive
    applyEffect: () => {
      document.body.style.animation = 'shake 0.5s infinite';
      document.body.style.filter = 'saturate(1.5)';
    },
    removeEffect: () => {
      document.body.style.animation = '';
      document.body.style.filter = '';
    },
    duration: 7000
  },
  { // Level 4: Very disruptive
    applyEffect: () => {
      document.body.style.animation = 'shake 0.3s infinite';
      document.body.style.filter = 'blur(1px) contrast(1.2)';
      document.body.style.transform = 'scale(0.98)';
      document.body.style.transition = 'transform 0.5s ease';
    },
    removeEffect: () => {
      document.body.style.animation = '';
      document.body.style.filter = '';
      document.body.style.transform = '';
      document.body.style.transition = '';
    },
    duration: 8000
  },
  { // Level 5: Maximum rage
    applyEffect: () => {
      document.body.style.animation = 'shake 0.2s infinite';
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      document.body.style.transform = 'scale(0.95) rotate(2deg)';
      
      // Create flashing effect
      const flashOverlay = document.createElement('div');
      flashOverlay.id = 'rage-flash-overlay';
      flashOverlay.style.position = 'fixed';
      flashOverlay.style.top = '0';
      flashOverlay.style.left = '0';
      flashOverlay.style.width = '100%';
      flashOverlay.style.height = '100%';
      flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      flashOverlay.style.zIndex = '9999';
      flashOverlay.style.animation = 'flash-rage 0.8s infinite';
      
      // Add flashing animation
      const style = document.createElement('style');
      style.id = 'rage-flash-style';
      style.innerHTML = `
        @keyframes flash-rage {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(flashOverlay);
    },
    removeEffect: () => {
      document.body.style.animation = '';
      document.body.style.filter = '';
      document.body.style.transform = '';
      
      // Remove flashing effect
      const flashOverlay = document.getElementById('rage-flash-overlay');
      const flashStyle = document.getElementById('rage-flash-style');
      
      if (flashOverlay) document.body.removeChild(flashOverlay);
      if (flashStyle) document.head.removeChild(flashStyle);
    },
    duration: 10000
  }
];

const FloatingEmoji = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [stateIndex, setStateIndex] = useState(0);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isTaunting, setIsTaunting] = useState(false);
  const [tauntText, setTauntText] = useState("");
  const [effectActive, setEffectActive] = useState(false);
  const [previousStateIndex, setPreviousStateIndex] = useState(0); // Track previous state to detect changes
  
  // New state for attention seeking
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());
  const [isAttentionSeeking, setIsAttentionSeeking] = useState<boolean>(false);
  const [attentionEmojiIndex, setAttentionEmojiIndex] = useState<number>(0);
  const [movementAnimation, setMovementAnimation] = useState<string>('');
  
  // New state for apology modal
  const [showApologyModal, setShowApologyModal] = useState<boolean>(false);
  const [userApologized, setUserApologized] = useState<boolean>(false);
  const [apologyInput, setApologyInput] = useState<string>('');
  
  // Refs for various timeouts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const randomMoveRef = useRef<NodeJS.Timeout | null>(null);
  const attentionSeekingRef = useRef<NodeJS.Timeout | null>(null);
  const attentionMoveRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes wiggle {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      
      @keyframes tada {
        0% { transform: scale(1) rotate(0deg); }
        10%, 20% { transform: scale(0.9) rotate(-3deg); }
        30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
        40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      @keyframes float {
        0% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-10px) translateX(10px); }
        50% { transform: translateY(0) translateX(20px); }
        75% { transform: translateY(10px) translateX(10px); }
        100% { transform: translateY(0) translateX(0); }
      }
      
      @keyframes slideIn {
        0% { transform: translateX(-100%) scale(0.5); opacity: 0; }
        100% { transform: translateX(0) scale(1); opacity: 1; }
      }
      
      @keyframes slideOut {
        0% { transform: translateX(0) scale(1); opacity: 1; }
        100% { transform: translateX(100%) scale(0.5); opacity: 0; }
      }
      
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
      }
      
      @keyframes teleport {
        0% { opacity: 1; transform: scale(1); }
        40% { opacity: 0; transform: scale(0.2); }
        60% { opacity: 0; transform: scale(0.2); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes jiggle {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      @keyframes attentionPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      .slideIn { animation: slideIn 0.5s forwards; }
      .slideOut { animation: slideOut 0.5s forwards; }
      .fadeIn { animation: fadeIn 0.5s forwards; }
      .fadeOut { animation: fadeOut 0.5s forwards; }
      .teleport { animation: teleport 0.6s forwards; }
      .jiggle { animation: jiggle 0.8s infinite; }
      .attentionPulse { animation: attentionPulse 1s infinite; }
    `;
    document.head.appendChild(style);
    
    // Initial random position
    moveToRandomPosition(); // Pass false to indicate it's not from user interaction
    
    // Start cooldown checker - when user hasn't interacted for a while, cool down
    cooldownRef.current = setInterval(() => {
      const now = Date.now();
      const secondsSinceLastInteraction = (now - lastInteractionTime) / 1000;
      
      // If user hasn't interacted for more than 30 seconds and emoji is angry
      if (secondsSinceLastInteraction > 30 && stateIndex > 0 && !showApologyModal) {
        // Cool down by one level
        setStateIndex(prev => {
          const newStateIndex = Math.max(0, prev - 1);
          // Update previous state to avoid triggering effect on auto-cooldown
          setPreviousStateIndex(newStateIndex);
          return newStateIndex;
        });
        
        // Reset interaction counter partially
        setInteractionCount(prev => Math.max(0, prev - 5));
      }
    }, 20000); // Check every 20 seconds
    
    // Start attention-seeking behavior checker
    attentionSeekingRef.current = setInterval(() => {
      const now = Date.now();
      const secondsSinceLastInteraction = (now - lastInteractionTime) / 1000;
      
      // If in calm state (level 0) and user hasn't interacted for more than 15 seconds
      if (secondsSinceLastInteraction > 15 && stateIndex === 0 && !isAttentionSeeking && !showApologyModal) {
        setIsAttentionSeeking(true);
        // Select random attention emoji
        setAttentionEmojiIndex(Math.floor(Math.random() * attentionSeekingEmojis.length));
        
        // Start moving for attention every 8 seconds
        startAttentionMovement();
        
        // Stop seeking attention after 25 seconds if no interaction
        setTimeout(() => {
          if (attentionMoveRef.current) {
            clearInterval(attentionMoveRef.current);
            attentionMoveRef.current = null;
          }
          setIsAttentionSeeking(false);
        }, 25000);
      }
    }, 15000); // Check every 15 seconds
    
    // Random movement for normal state (only if not attention seeking)
    randomMoveRef.current = setInterval(() => {
      // Allow movement only in calm state, not during attention seeking
      if (stateIndex === 0 && !effectActive && !isAttentionSeeking && !showApologyModal) {
        // 40% chance to move randomly
        if (Math.random() < 0.4) {
          moveToRandomPosition(); // Not from user interaction
        }
      }
    }, 8000); // Check every 8 seconds

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      if (effectTimeoutRef.current) clearTimeout(effectTimeoutRef.current);
      if (attentionSeekingRef.current) clearInterval(attentionSeekingRef.current);
      if (randomMoveRef.current) clearInterval(randomMoveRef.current);
      if (attentionMoveRef.current) clearInterval(attentionMoveRef.current);
      
      // Reset all effects
      websiteEffects.forEach(effect => effect.removeEffect());
    };
  }, [lastInteractionTime, isAttentionSeeking, showApologyModal]);

  // Start attention movement pattern
  const startAttentionMovement = () => {
    // Clear any existing interval
    if (attentionMoveRef.current) {
      clearInterval(attentionMoveRef.current);
    }
    
    // Move immediately once
    moveAttentionEmoji();
    
    // Then move every 8 seconds
    attentionMoveRef.current = setInterval(() => {
      if (isAttentionSeeking) {
        moveAttentionEmoji();
        // Change the attention emoji
        setAttentionEmojiIndex(prev => (prev + 1) % attentionSeekingEmojis.length);
      } else {
        // Stop if no longer attention seeking
        if (attentionMoveRef.current) {
          clearInterval(attentionMoveRef.current);
          attentionMoveRef.current = null;
        }
      }
    }, 8000);
  };

  // Move the attention-seeking emoji
  const moveAttentionEmoji = () => {
    // Generate attention-getting animation
    const animations = ['bounce', 'pulse', 'wiggle', 'tada'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setMovementAnimation(randomAnimation);
    
    // Calculate viewport dimensions with some padding
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For mobile: ensure emoji is always visible and reachable
    const safeMargin = isTouchDevice ? 120 : 80; // Larger margin for touch devices
    
    // Calculate new position prioritizing areas likely to get attention
    // Prefer positions near the center or along the edges that would catch attention
    let newX, newY;
    
    const attentionPositions = [
      // Center area - high visibility
      { x: viewportWidth / 2 - 100 + Math.random() * 200, y: viewportHeight / 2 - 100 + Math.random() * 200 },
      // Left center edge
      { x: safeMargin, y: viewportHeight / 2 - 100 + Math.random() * 200 },
      // Right center edge
      { x: viewportWidth - safeMargin - 100, y: viewportHeight / 2 - 100 + Math.random() * 200 },
      // Top center
      { x: viewportWidth / 2 - 100 + Math.random() * 200, y: safeMargin },
      // Bottom center
      { x: viewportWidth / 2 - 100 + Math.random() * 200, y: viewportHeight - safeMargin - 100 }
    ];
    
    // Pick a random attention position
    const selectedPosition = attentionPositions[Math.floor(Math.random() * attentionPositions.length)];
    newX = selectedPosition.x;
    newY = selectedPosition.y;
    
    // Ensure within bounds
    newX = Math.max(safeMargin, Math.min(viewportWidth - safeMargin, newX));
    newY = Math.max(safeMargin, Math.min(viewportHeight - safeMargin, newY));
    
    // Update position with animation
    setPosition({ x: newX, y: newY });
  };

  // Monitor state changes to apply website effects
  useEffect(() => {
    // Only apply effect if state has changed (and not on component mount)
    if (stateIndex !== previousStateIndex) {
      applyAngerEffect();
      
      // Check if we've reached max anger level
      if (stateIndex === emojiStates.length - 1) {
        playEmojiAngry();
        // Show apology modal after a short delay
        setTimeout(() => {
          setShowApologyModal(true);
        }, 2000);
      }
    }
    
    // Update previous state
    setPreviousStateIndex(stateIndex);
  }, [stateIndex]);




  // Apply website effect based on anger level
  const applyAngerEffect = () => {
    // If already showing an effect, remove it first
    if (effectActive && effectTimeoutRef.current) {
      clearTimeout(effectTimeoutRef.current);
      websiteEffects[previousStateIndex].removeEffect();
      setEffectActive(false);
    }
    
    const effectConfig = websiteEffects[stateIndex];
    
    // Apply the effect for all levels (including level 0 which removes effects)
    setEffectActive(true);
    
    // Apply the effect
    effectConfig.applyEffect();
    
    // Set a timer to remove the effect only if it's not level 0
    if (stateIndex > 0) {
      effectTimeoutRef.current = setTimeout(() => {
        effectConfig.removeEffect();
        setEffectActive(false);
      }, effectConfig.duration);
    } else {
      // For level 0, we still need to remove the effect flag
      setEffectActive(false);
    }
  };

  // Move to a new random position with animation
     const {playAttentionEmojiMove , playEmojiAngry} = useSoundPlayer();

  const moveToRandomPosition = () => {
    // Don't move if showing apology modal
    if (showApologyModal) return;
    // Generate transition animation
    const animations = ['slideOut', 'fadeOut', 'teleport'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setMovementAnimation(randomAnimation);
    
     playAttentionEmojiMove();
    // Brief disappearance effect with animation
    setIsVisible(false);
    
    // Calculate viewport dimensions with some padding
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For mobile: ensure emoji is always visible and reachable
    // Make sure it doesn't go too close to edges where it might be hard to tap
    const safeMargin = isTouchDevice ? 120 : 80; // Larger margin for touch devices
    
    // Calculate new position, ensuring it stays within viewport bounds
    const newX = Math.max(safeMargin, Math.min(viewportWidth - safeMargin, Math.random() * viewportWidth));
    const newY = Math.max(safeMargin, Math.min(viewportHeight - safeMargin, Math.random() * viewportHeight));
    
    // On mobile, avoid positions that might interfere with common UI elements
    // Avoid top navigation bars and bottom navigation areas
    let adjustedY = newY;
    if (isTouchDevice) {
      // Avoid top 15% of screen (headers, navigation bars)
      if (adjustedY < viewportHeight * 0.15) {
        adjustedY = viewportHeight * 0.15 + Math.random() * (viewportHeight * 0.2);
      }
      
      // Avoid bottom 15% of screen (navigation bars, gesture areas)
      if (adjustedY > viewportHeight * 0.85) {
        adjustedY = viewportHeight * 0.4 + Math.random() * (viewportHeight * 0.45);
      }
    }
    
    // Pick a new random emoji from the current state level
    setCurrentEmojiIndex(Math.floor(Math.random() * emojiStates[stateIndex].options.length));
    
    // Generate appearance animation
    const appearAnimations = ['slideIn', 'fadeIn', 'jiggle'];
    const randomAppearAnimation = appearAnimations[Math.floor(Math.random() * appearAnimations.length)];
    
    timeoutRef.current = setTimeout(() => {
      setPosition({ x: newX, y: adjustedY });
      setMovementAnimation(randomAppearAnimation);
      setIsVisible(true);
    }, isTouchDevice ? 200 : 300); // Faster reappearance on mobile for better responsiveness
  };

  // Taunt the user
  const showTaunt = () => {
    // Select a random taunt message
    const taunts = emojiStates[stateIndex].teasingTexts;
    const randomTaunt = taunts[Math.floor(Math.random() * taunts.length)];
    
    setTauntText(randomTaunt);
    setIsTaunting(true);
    
    // Hide the taunt after 2 seconds
    setTimeout(() => {
      setIsTaunting(false);
    }, 2000);
  };

  // Detect if device is touch-based
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Check for touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  // Handle interaction attempts
  const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default touch behavior on mobile to avoid scrolling
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    
    // Don't process interactions when showing apology modal
    if (showApologyModal) return;
    
    // Update last interaction time
    setLastInteractionTime(Date.now());
    
    // Turn off attention seeking mode when user interacts
    if (isAttentionSeeking) {
      setIsAttentionSeeking(false);
      if (attentionMoveRef.current) {
        clearInterval(attentionMoveRef.current);
        attentionMoveRef.current = null;
      }
    }
    
    // Only process normal emoji state interactions if not in attention seeking mode
    if (!isAttentionSeeking) {
      // Increment interaction counter
      setInteractionCount(prev => prev + 1);
      
      // Show a taunting message
      showTaunt();
      
      // Move to a random position
      moveToRandomPosition(); // Pass true to indicate it's from user interaction
      
      // For touch devices, make the emoji move quicker and be more responsive
      if (isTouchDevice && 'touches' in event) {
        // Create a larger movement on touch to make it more challenging but still catchable
        setTimeout(() => {
          moveToRandomPosition(); // Second move on touch with isUserInteraction=true
        }, 500);
      }
      
      // Progress anger state based on interaction count
      // After every 5 interactions, get angrier if not at max already
      if (interactionCount % 5 === 4 && stateIndex < emojiStates.length - 1) {
        const newStateIndex = Math.min(stateIndex + 1, emojiStates.length - 1);
        setStateIndex(newStateIndex);
      }
    }
  };

  // Handle apology form submission
  const handleApologySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the apology contains "sorry" (case insensitive)
    if (apologyInput.toLowerCase().includes('sorry')) {
      // Accept the apology
      setUserApologized(true);
      
      // After showing success message, reset to level 0
      setTimeout(() => {
        setShowApologyModal(false);
        setStateIndex(0);
        setInteractionCount(0);
        setUserApologized(false);
        setApologyInput('');
        moveToRandomPosition();
      }, 3000);
    } else {
      // Shake the input to indicate rejection
      const inputElement = document.getElementById('apology-input');
      console.log(inputElement);
      if (inputElement) {
        inputElement.style.animation = 'shake 0.3s infinite';
        setTimeout(() => {
          inputElement.style.animation = '';
        }, 500);
      }
      }
    };
  
    // Get current emoji and text
    let currentEmoji, currentText;
    
    if (isAttentionSeeking) {
      // Use attention-specific emojis when seeking attention
      currentEmoji = attentionSeekingEmojis[attentionEmojiIndex].emoji;
      currentText = attentionSeekingEmojis[attentionEmojiIndex].text;
    } else {
      // Use normal state emojis
      currentEmoji = emojiStates[stateIndex].options[currentEmojiIndex].emoji;
      currentText = isTaunting ? tauntText : 
                    emojiStates[stateIndex].options[currentEmojiIndex].text;
    }
  
    // Add animation style based on anger level and interaction
    let animationStyle = {};
    if (isAttentionSeeking) {
      animationStyle = { animation: 'attentionPulse 1s infinite ease-in-out' };
    } else if (stateIndex === 0) {
      animationStyle = { animation: 'bounce 2s infinite ease-in-out' };
    } else if (stateIndex === 1) {
      animationStyle = { animation: 'bounce 1.5s infinite ease-in-out' };
    } else if (stateIndex === 2) {
      animationStyle = { animation: 'bounce 1s infinite ease-in-out' };
    } else if (stateIndex >= 3) {
      animationStyle = { animation: 'bounce 0.8s infinite ease-in-out, spin 3s infinite linear' };
    }
  
    // Adjust size based on device type
    const emojiSize = isTouchDevice ? "text-5xl" : "text-4xl"; 
    const containerSize = isTouchDevice ? "p-5" : "p-4";
  
    return (
      <>
        {/* Main floating emoji */}
        <div 
          className={`fixed z-50 transition-all duration-300 cursor-pointer select-none ${movementAnimation}`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            opacity: isVisible ? 1 : 0,
            transform: `scale(${isVisible ? 1 : 0.5})`,
            pointerEvents: isVisible ? 'auto' : 'none',
            ...animationStyle
          }}
          onClick={handleInteraction}
          onMouseEnter={isTouchDevice ? undefined : handleInteraction}
          onTouchStart={handleInteraction}
          onTouchEnd={(e) => e.preventDefault()} // Prevent ghost clicks
        >
          <div 
            className={`flex flex-col items-center bg-white bg-opacity-80 rounded-lg ${containerSize} shadow-lg ${
              stateIndex >= 4 ? 'bg-red-100' : stateIndex >= 2 ? 'bg-yellow-100' : 'bg-white'
            } ${isAttentionSeeking ? 'ring-2 ring-blue-400' : ''}`}
          >
            <div className={`${emojiSize} mb-2`}>{currentEmoji}</div>
            <div className={`${isTouchDevice ? 'text-base' : 'text-sm'} font-bold text-center ${
              isAttentionSeeking ? 'text-blue-600 italic' : 
              isTaunting ? 'text-red-500' : 
              stateIndex >= 4 ? 'text-red-600' : 
              stateIndex >= 2 ? 'text-yellow-600' : 
              'text-blue-600'
            }`}>{currentText}</div>
          </div>
        </div>
        
        {/* Apology Modal */}
        {showApologyModal && (
          <div id="apology-input" className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
              {!userApologized ? (
                <form onSubmit={handleApologySubmit} className="space-y-4">
                  <div className="text-center text-2xl mb-6">
                    <span className="text-5xl mb-4 block">😡</span>
                    <h2 className="font-bold text-red-600">You made me FURIOUS!</h2>
                    <p className="text-gray-700 mt-2">Please apologize to continue using this website.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="apology-input" className="block text-sm font-medium text-gray-700">
                      Type your apology:
                    </label>
                    <input
                      // id=
                      type="text"
                      value={apologyInput}
                      onChange={(e) => setApologyInput(e.target.value)}
                      placeholder="Type 'Sorry' 😒"
                      className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      required
                    />
                    <p className="text-xs text-gray-500 italic">Hint: Make sure to say &quot;sorry&quot;</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Submit Apology
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <span className="text-5xl mb-4 block">😊</span>
                  <h2 className="text-xl font-medium text-green-600">Apology accepted!</h2>
                  <p className="mt-2 text-gray-600">Thank you for apologizing. Let&apos;s be friends again!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default FloatingEmoji;