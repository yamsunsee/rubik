import { useState, useEffect, useRef, useCallback } from "react";
import { twMerge as cn } from "tailwind-merge";

const HOLD_DURATION = 500;

type TimerState = "idle" | "holding" | "ready" | "running" | "stopped";

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  return `${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
};

type TimerProps = {
  onStopped: () => void;
};

const Timer = ({ onStopped }: TimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState<number>(0);

  const timerStateRef = useRef<TimerState>("idle");
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdAnimationFrameRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const runAnimationFrameRef = useRef<number | null>(null);
  const runStartTimeRef = useRef<number | null>(null);
  const currentElapsedRef = useRef<number>(0);

  const updateTimerState = useCallback((nextState: TimerState) => {
    timerStateRef.current = nextState;
    setTimerState(nextState);
  }, []);

  const startHoldProgressAnimation = useCallback(() => {
    holdStartTimeRef.current = performance.now();
    const animateTick = () => {
      const percentage = Math.min(
        100,
        ((performance.now() - holdStartTimeRef.current!) / HOLD_DURATION) * 100,
      );
      if (percentage < 100) {
        holdAnimationFrameRef.current = requestAnimationFrame(animateTick);
      }
    };
    holdAnimationFrameRef.current = requestAnimationFrame(animateTick);
  }, []);

  const cancelHoldProgressAnimation = useCallback(() => {
    if (holdAnimationFrameRef.current !== null) {
      cancelAnimationFrame(holdAnimationFrameRef.current);
      holdAnimationFrameRef.current = null;
    }
  }, []);

  const startTimerAnimation = useCallback(() => {
    runStartTimeRef.current = performance.now();
    const animateTick = () => {
      const milliseconds = performance.now() - runStartTimeRef.current!;
      currentElapsedRef.current = milliseconds;
      setElapsed(milliseconds);
      runAnimationFrameRef.current = requestAnimationFrame(animateTick);
    };
    runAnimationFrameRef.current = requestAnimationFrame(animateTick);
  }, []);

  const cancelTimerAnimation = useCallback(() => {
    if (runAnimationFrameRef.current !== null) {
      cancelAnimationFrame(runAnimationFrameRef.current);
      runAnimationFrameRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if (event.repeat) return;
      event.preventDefault();

      const currentState = timerStateRef.current;

      if (currentState === "running") {
        cancelTimerAnimation();
        const finalElapsed = currentElapsedRef.current;
        setElapsed(finalElapsed);
        updateTimerState("stopped");
        onStopped();
        return;
      }

      if (currentState === "idle" || currentState === "stopped") {
        updateTimerState("holding");
        startHoldProgressAnimation();
        holdTimerRef.current = setTimeout(() => {
          if (timerStateRef.current === "holding") {
            cancelHoldProgressAnimation();
            updateTimerState("ready");
          }
        }, HOLD_DURATION);
      }
    },
    [
      updateTimerState,
      startHoldProgressAnimation,
      cancelHoldProgressAnimation,
      cancelTimerAnimation,
    ],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();

      const currentState = timerStateRef.current;

      if (currentState === "holding") {
        if (holdTimerRef.current !== null) clearTimeout(holdTimerRef.current);
        cancelHoldProgressAnimation();
        updateTimerState("idle");
        return;
      }

      if (currentState === "ready") {
        setElapsed(0);
        currentElapsedRef.current = 0;
        updateTimerState("running");
        startTimerAnimation();
      }
    },
    [updateTimerState, cancelHoldProgressAnimation, startTimerAnimation],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const timerColorClass: Record<TimerState, string> = {
    idle: "text-white",
    holding: "text-rose-500",
    ready: "text-emerald-500",
    running: "text-amber-500",
    stopped: "text-sky-500",
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4 select-none">
      <div
        className={cn(
          "text-9xl leading-none font-bold tabular-nums transition-colors duration-100",
          timerColorClass[timerState],
        )}
      >
        {formatTime(elapsed)}
      </div>
    </div>
  );
};

export default Timer;
