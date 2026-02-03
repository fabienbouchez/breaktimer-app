import { useEffect, useState } from "react";
import moment from "moment";

interface BlinkingCoffeeProps {
  startTime: moment.Moment;
}

export function BlinkingCoffee({ startTime }: BlinkingCoffeeProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  const calculateBlinkInterval = () => {
    const msElapsed = moment().diff(startTime, "milliseconds");
    const minutesElapsed = msElapsed / 60000;

    // Première minute: toutes les 5 secondes
    if (minutesElapsed < 1) {
      return 5000;
    }
    // Entre 1 et 10 minutes: toutes les 2 secondes
    if (minutesElapsed < 10) {
      return 2000;
    }
    // Après 10 minutes: progression linéaire vers 500ms (2x/seconde) à 60 minutes
    // De 2000ms à 500ms sur 50 minutes
    const progressAfter10Min = Math.min((minutesElapsed - 10) / 50, 1);
    return 2000 - (1500 * progressAfter10Min); // 2000ms -> 500ms
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const setupInterval = () => {
      const blinkInterval = calculateBlinkInterval();
      
      interval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 300);
      }, blinkInterval);
    };
    
    setupInterval();
    
    // Recalculer l'intervalle toutes les 10 secondes pour ajuster la vitesse
    const recalcInterval = setInterval(() => {
      clearInterval(interval);
      setupInterval();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(recalcInterval);
    };
  }, [startTime]);

  return (
    <span
      style={{
        marginLeft: "0.5rem",
        transform: isPulsing ? "scale(1.25)" : "scale(1)",
        opacity: isPulsing ? 0.3 : 1,
        transition: "transform 0.3s cubic-bezier(0.36, 0, 0.66, -0.56), opacity 0.3s",
      }}
    >
      ☕
    </span>
  );
}
