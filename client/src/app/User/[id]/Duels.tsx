import { Chart, registerables } from "chart.js";
import { useRef, useEffect } from "react";

Chart.register(...registerables);

interface Prop {
  duels: { submission: number, hardQuestion: number, mediumQuestion: number, easyQuestion: number } | null | undefined;
}

const Duels: React.FC<Prop> = ({ duels }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!duels) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: "doughnut",  // Changed from polarArea to doughnut
      data: {
        labels: ["Submission", "Hard", "Medium", "Easy"],
        datasets: [
          {
            label: "Dataset",
            data: [duels.submission, duels.hardQuestion, duels.mediumQuestion, duels.easyQuestion],
            backgroundColor: ["red", "orange", "yellow", "green"],
            borderWidth: 1
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Doughnut Chart Example" },
        },
      },
    });
  }, [duels]);

  return <canvas className="h-10 w-10 border-2 border-white" ref={canvasRef}></canvas>; 
};

export default Duels;