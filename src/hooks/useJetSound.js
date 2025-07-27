import { useRef } from 'react';

export function useJetSound() {
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);
  const lfoRef = useRef(null);

  const startJetSound = () => {
    if (audioCtxRef.current) return; // Already playing

    console.log('Starting jet sound...');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('Audio context created:', audioCtx);
    
    // Resume audio context if suspended (required for user interaction)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        console.log('Audio context resumed');
      });
    }

    // Base oscillator: mechanical drone
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth'; // More mechanical than square
    oscillator.frequency.setValueAtTime(120, audioCtx.currentTime); // Higher frequency for better audibility

    // Volume control
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Higher volume

    // Mechanical pulsing effect
    const lfo = audioCtx.createOscillator();
    lfo.type = 'triangle'; // More mechanical than sine
    lfo.frequency.setValueAtTime(8, audioCtx.currentTime); // Faster pulses for more noticeable effect

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime); // More noticeable pulse intensity

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain); // Modulate gain for mechanical pulsing

    // Connect audio nodes
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    // Start everything
    oscillator.start();
    lfo.start();
    console.log('Jet sound started successfully');

    audioCtxRef.current = audioCtx;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    lfoRef.current = lfo;
  };

  const stopJetSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
      }

      if (gainRef.current) {
        gainRef.current.disconnect();
      }

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }

      // Clear all references
      audioCtxRef.current = null;
      oscillatorRef.current = null;
      gainRef.current = null;
      lfoRef.current = null;
      
      console.log('Jet sound stopped and cleaned up');
    } catch (error) {
      console.log('Error stopping jet sound:', error);
    }
  };

  // Test function to check if Web Audio API works
  const testAudio = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 100);
      
      console.log('Test audio played successfully');
    } catch (error) {
      console.log('Test audio failed:', error);
    }
  };

  return { startJetSound, stopJetSound, testAudio };
}
 