// components/ChallengeProgressUpdater.tsx
import { useState } from "react";

interface Challenge {
  id: string | number;
  progress: number;
  current_step: number;
  steps: string[]; // adjust type if steps are objects instead of strings
}

interface Props {
  challenge: Challenge;
}

export const ChallengeProgressUpdater = ({ challenge }: Props) => {
  const [progress, setProgress] = useState<number>(challenge.progress);
  const [currentStep, setCurrentStep] = useState<number>(challenge.current_step);
  const [updating, setUpdating] = useState<boolean>(false);

  const updateProgress = async (): Promise<void> => {
    setUpdating(true);
    try {
      const response = await fetch("/api/update-challenge-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          progress,
          currentStep,
          status: progress >= 100 ? "completed" : "active",
        }),
      });

      if (response.ok) {
        alert("Progress updated successfully!");
      } else {
        alert("Error updating progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Error updating progress");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h4 className="font-semibold mb-2">Update Progress</h4>
      <div className="space-y-2">
        <div>
          <label className="block text-sm">Progress %</label>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="w-full"
          />
          <span>{progress}%</span>
        </div>
        <div>
          <label className="block text-sm">Current Step</label>
          <select
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {challenge.steps.map((_, index) => (
              <option key={index} value={index}>
                Step {index + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={updateProgress}
          disabled={updating}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {updating ? "Updating..." : "Update Progress"}
        </button>
      </div>
    </div>
  );
};
