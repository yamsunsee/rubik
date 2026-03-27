import { useState, useEffect, useRef, useCallback } from "react";
import { twMerge as cn } from "tailwind-merge";

const HOLD_DURATION = 1000;

type TimerState = "idle" | "holding" | "ready" | "running" | "stopped";

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  return `${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
};

const RubikTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState<number>(0);
  const [holdProgress, setHoldProgress] = useState<number>(0);

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
      setHoldProgress(percentage);
      if (percentage < 100) {
        holdAnimationFrameRef.current = requestAnimationFrame(animateTick);
      }
    };
    holdAnimationFrameRef.current = requestAnimationFrame(animateTick);
  }, []);

  const cancelHoldProgressAnimation = useCallback((keepFull: boolean) => {
    if (holdAnimationFrameRef.current !== null) {
      cancelAnimationFrame(holdAnimationFrameRef.current);
      holdAnimationFrameRef.current = null;
    }
    setHoldProgress(keepFull ? 100 : 0);
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
        return;
      }

      if (currentState === "idle" || currentState === "stopped") {
        updateTimerState("holding");
        startHoldProgressAnimation();
        holdTimerRef.current = setTimeout(() => {
          if (timerStateRef.current === "holding") {
            cancelHoldProgressAnimation(true);
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
        cancelHoldProgressAnimation(false);
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

  const barColorClass: Record<TimerState, string> = {
    idle: "bg-white",
    holding: "bg-rose-500",
    ready: "bg-emerald-500",
    running: "bg-amber-500",
    stopped: "bg-sky-500",
  };

  const statusText: Record<TimerState, string> = {
    idle: "hold space to prepare",
    holding: "keep holding...",
    ready: "release space to start",
    running: "press space to stop",
    stopped: "hold space to reset",
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4 select-none">
      <p
        className={cn(
          "text-9xl leading-none font-bold tabular-nums transition-colors duration-100",
          timerColorClass[timerState],
        )}
      >
        {formatTime(elapsed)}
      </p>

      <div className="h-1 w-80 overflow-hidden rounded-full bg-white">
        <div
          className={cn(
            "h-full rounded-full transition-colors duration-150",
            barColorClass[timerState],
          )}
          style={{
            width: `${holdProgress}%`,
            transition: holdProgress === 0 ? "none" : undefined,
          }}
        />
      </div>

      <p
        className={cn(
          "text-2xl font-bold tracking-widest uppercase transition-colors duration-100",
          timerColorClass[timerState],
        )}
      >
        {statusText[timerState]}
      </p>
    </div>
  );
};

export default RubikTimer;
