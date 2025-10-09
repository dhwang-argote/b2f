import { motion } from "framer-motion";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  value?: string | number;
  subLabel?: string;
  className?: string;
  showPercent?: boolean;
}

const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#00B2FF",
  backgroundColor = "#2a2a2a",
  label,
  value,
  subLabel,
  className = "",
  showPercent = true,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight pointer-events-none">
          {showPercent && (
            <div className="text-sm font-semibold text-white">
              {Math.round(percentage)}%
            </div>
          )}
          {value && (
            <div className="text-lg md:text-xl font-bold text-primary">
              {value}
            </div>
          )}
          {subLabel && <div className="text-xs text-white/60">{subLabel}</div>}
        </div>
      </div>

      {label && (
        <div className="mt-2 text-sm text-white/80 text-center font-medium">
          {label}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
