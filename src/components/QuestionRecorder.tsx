import React, { useEffect, useRef, useState } from "react";


type QuestionRecorderProps = {
	question: string;
	onTranscript: (text: string) => void;
	googleApiKey?: string; // Google Cloud API key
	disabled?: boolean; // Disable recording when true
	autoStart?: boolean; // Automatically start when question changes
};

/**
 * Plays the question via TTS, then records mic input.
 * Recording auto-stops after 3s of silence and sends audio to Google Cloud Speech-to-Text API.
 * Requires VITE_GOOGLE_CLOUD_API_KEY environment variable.
 */
const QuestionRecorder: React.FC<QuestionRecorderProps> = ({
	question,
	onTranscript,
	googleApiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY,
	disabled = false,
	autoStart = false,
}) => {
	const [speaking, setSpeaking] = useState(false);
	const [recording, setRecording] = useState(false);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const silenceStartRef = useRef<number | null>(null);
	const silenceTimerRef = useRef<number | null>(null);
	const previousQuestionRef = useRef<string>("");
	const hasStartedRef = useRef<boolean>(false);

	useEffect(() => {
		return () => {
			cleanup();
		};
	}, []);

	// Auto-start when question changes (after initial manual start)
	useEffect(() => {
		if (
			autoStart &&
			hasStartedRef.current &&
			question !== previousQuestionRef.current &&
			!disabled &&
			!speaking &&
			!recording &&
			googleApiKey
		) {
			previousQuestionRef.current = question;
			// Small delay to ensure UI is ready
			setTimeout(() => {
				speakQuestion();
			}, 500);
		} else if (question !== previousQuestionRef.current) {
			previousQuestionRef.current = question;
		}
	}, [question, autoStart, disabled, speaking, recording, googleApiKey]);

	useEffect(() => {
		if (!googleApiKey) {
			setError("Google Cloud API key not configured. Set VITE_GOOGLE_CLOUD_API_KEY in your .env file.");
		}
	}, [googleApiKey]);

	const cleanup = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		}
		if (audioContextRef.current) {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}
		if (silenceTimerRef.current) {
			cancelAnimationFrame(silenceTimerRef.current);
		}
		chunksRef.current = [];
		setRecording(false);
		setSpeaking(false);
		setStatus("");
	};

	const speakQuestion = () => {
		setError("");
		setStatus("Reading question…");
		hasStartedRef.current = true; // Mark that we've started the flow
		const utterance = new SpeechSynthesisUtterance(question);
		setSpeaking(true);
		utterance.onend = () => {
			setSpeaking(false);
			startRecording();
		};
		speechSynthesis.speak(utterance);
	};

	const startRecording = async () => {
		try {
			setStatus("Starting microphone…");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
			const audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(stream);
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 2048;
			source.connect(analyser);
			audioContextRef.current = audioContext;
			analyserRef.current = analyser;

			chunksRef.current = [];
			recorder.ondataavailable = (e) => {
				chunksRef.current.push(e.data);
			};
			recorder.onstop = async () => {
				stream.getTracks().forEach((t) => t.stop());
				stopSilenceMonitor();
				setRecording(false);
				setStatus("Sending to Google Cloud Speech-to-Text…");
				await sendToGoogleSpeechAPI();
			};

			mediaRecorderRef.current = recorder;
			recorder.start();
			setRecording(true);
			setStatus("Recording…");
			startSilenceMonitor();
		} catch (err) {
			setError("Microphone permission denied or unavailable.");
			cleanup();
		}
	};

	const startSilenceMonitor = () => {
		silenceStartRef.current = null;
		const checkSilence = () => {
			if (!analyserRef.current || !audioContextRef.current) return;
			const buffer = new Uint8Array(analyserRef.current.fftSize);
			analyserRef.current.getByteTimeDomainData(buffer);
			// Compute RMS to detect volume
			let sumSquares = 0;
			for (let i = 0; i < buffer.length; i++) {
				const val = (buffer[i] - 128) / 128;
				sumSquares += val * val;
			}
			const rms = Math.sqrt(sumSquares / buffer.length);
			const now = performance.now();
			const silenceThreshold = 0.01;
			const silenceDuration = 3000; // ms
			if (rms < silenceThreshold) {
				if (silenceStartRef.current === null) {
					silenceStartRef.current = now;
				} else if (now - silenceStartRef.current > silenceDuration) {
					stopRecording();
					return;
				}
			} else {
				silenceStartRef.current = null;
			}
			silenceTimerRef.current = requestAnimationFrame(checkSilence);
		};
		silenceTimerRef.current = requestAnimationFrame(checkSilence);
	};

	const stopSilenceMonitor = () => {
		if (silenceTimerRef.current) cancelAnimationFrame(silenceTimerRef.current);
		silenceTimerRef.current = null;
		silenceStartRef.current = null;
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
			mediaRecorderRef.current.stop();
			setStatus("Processing audio…");
		}
	};

	const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
		const bytes = new Uint8Array(buffer);
		const chunk = 0x8000; // 32KB
		let binary = "";
		for (let i = 0; i < bytes.length; i += chunk) {
			const sub = bytes.subarray(i, i + chunk);
			binary += String.fromCharCode.apply(null, Array.from(sub));
		}
		return btoa(binary);
	};

	const sendToGoogleSpeechAPI = async () => {
		try {
			if (!googleApiKey) {
				setError("Google Cloud API key not configured.");
				return;
			}

			// Create blob from recorded chunks
			const blob = new Blob(chunksRef.current, { type: "audio/webm" });

			// Convert blob to base64
			const reader = new FileReader();
			reader.readAsArrayBuffer(blob);

			reader.onloadend = async () => {
				try {
					const base64Audio = arrayBufferToBase64(reader.result as ArrayBuffer);

					// Call Google Cloud Speech-to-Text API
					const response = await fetch(
						`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								config: {
									encoding: "WEBM_OPUS",
									languageCode: "en-US",
								},
								audio: {
									content: base64Audio,
								},
							}),
						}
					);

					if (!response.ok) {
						throw new Error(`API error: ${response.statusText}`);
					}

					const data = await response.json();

					if (data.results && data.results.length > 0) {
						const transcript = data.results
							.map((result: any) =>
								result.alternatives
									.map((alt: any) => alt.transcript)
									.join(" ")
							)
							.join(" ");

						onTranscript(transcript);
						setStatus("Transcription complete");
					} else {
						setError("No speech detected. Please try again.");
						setStatus("");
					}
				} catch (err) {
					setError(`Speech-to-text failed: ${(err as Error).message}`);
					setStatus("");
				}
			};
		} catch (err) {
			setError(`Error processing audio: ${(err as Error).message}`);
			setStatus("");
		}
	};

	return (
		<div className="question-recorder">
			<div className="actions">
				<button
					className="primary"
					onClick={speakQuestion}
					disabled={speaking || recording || !googleApiKey || disabled}
					title={!googleApiKey ? "Google API key not configured" : disabled ? "Conversation stopped" : ""}
				>
					{speaking ? "Speaking…" : recording ? "Recording…" : "Play"}
				</button>
				{recording && (
					<button className="secondary" onClick={stopRecording}>
						Stop recording
					</button>
				)}
			</div>
			{status && <p className="status">{status}</p>}
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default QuestionRecorder;