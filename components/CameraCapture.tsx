"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CameraCapture.module.css";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  capturedImage: string | null;
  onRetake: () => void;
}

export default function CameraCapture({ onCapture, capturedImage, onRetake }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      } catch {
        if (!cancelled) {
          setCameraError("Camera permission denied or unavailable. You can still upload an image below.");
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", 0.85));
  }

  return (
    <div className={styles.cameraArea}>
      {capturedImage ? (
        <div className={styles.previewWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element -- runtime data URL, not a static asset */}
          <img src={capturedImage} alt="Captured item" className={styles.preview} />
          <button type="button" onClick={onRetake} className={styles.secondaryButton}>
            Retake Picture
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
          {cameraError && <p className={styles.hint}>{cameraError}</p>}
          <button type="button" onClick={handleCapture} disabled={!cameraReady} className={styles.captureButton}>
            Take Picture
          </button>
        </>
      )}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
    </div>
  );
}
