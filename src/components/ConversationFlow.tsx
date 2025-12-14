import React, { useState, useCallback } from "react";
import QuestionRecorder from "./QuestionRecorder";
import { QuestionAnswer, LLM_Response } from "../types/classTypes";
import "./ConversationFlow.css";

interface ConversationFlowProps {
	onboardingAnswers: Record<string, string | string[]>;
	userProfile: { name?: string; email?: string; picture?: string };
	apiBase?: string;
}

const INITIAL_QUESTION =
	"Do you agree with the statement: I know exactly what to say in my head, but can't find the right words?";

const ConversationFlow: React.FC<ConversationFlowProps> = ({
	onboardingAnswers,
	userProfile,
	apiBase = import.meta.env.VITE_API_BASE_URL || "https://backend-langflu-webapp-422555260560.europe-west1.run.app",
}) => {
	const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([
		new QuestionAnswer(INITIAL_QUESTION, "", ""),
	]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isStopped, setIsStopped] = useState(false);
	const [status, setStatus] = useState("");

	const sendToBackend = useCallback(
		async (qaList: QuestionAnswer[]): Promise<LLM_Response | null> => {
			try {
				setStatus("Sending to backend...");
				const response = await fetch(`${apiBase}/api/conversation`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						question_answers: qaList.map((qa) => ({
							quest: qa.quest,
							user_answer: qa.user_answer,
							expected_answer: qa.expected_answer,
						})),
						onboarding_answers: onboardingAnswers,
					}),
				});

				if (!response.ok) {
					throw new Error(`Backend error: ${response.statusText}`);
				}

				const data: LLM_Response = await response.json();
				return data;
			} catch (err) {
				setStatus(`Error: ${(err as Error).message}`);
				return null;
			}
		},
		[apiBase, userProfile, onboardingAnswers]
	);

	const handleTranscript = useCallback(
		async (transcript: string) => {
			if (isStopped || isProcessing) return;

			setIsProcessing(true);
			setStatus("Processing your answer...");

			// Update current object's user_answer
			const updatedList = [...questionAnswers];
			updatedList[currentIndex].user_answer = transcript;
			setQuestionAnswers(updatedList);

			// Send to backend
			const llmResponse = await sendToBackend(updatedList);

			if (llmResponse) {
				// Store suggested_answer in current object's expected_answer
				updatedList[currentIndex].expected_answer = llmResponse.suggested_answer;

				// Add new object with next_question
				updatedList.push(new QuestionAnswer(llmResponse.next_question, "", ""));

				setQuestionAnswers(updatedList);
				setCurrentIndex(updatedList.length - 1);
				setStatus("Ready for next question");
			} else {
				setStatus("Failed to get response from backend");
			}

			setIsProcessing(false);
		},
		[questionAnswers, currentIndex, isStopped, isProcessing, sendToBackend]
	);

	const handleStop = () => {
		setIsStopped(true);
		setStatus("Conversation stopped");
	};

	const currentQuestion = questionAnswers[currentIndex]?.quest || "";

	return (
		<div className="conversation-flow">
			<div className="conversation-header">
				<h3>Practice Session</h3>
				{!isStopped && (
					<button className="secondary stop-btn" onClick={handleStop}>
						Stop
					</button>
				)}
			</div>

			<div className="question-block">
				<p className="question-text">{currentQuestion}</p>
				<QuestionRecorder
					question={currentQuestion}
					onTranscript={handleTranscript}
					disabled={isStopped || isProcessing}
					autoStart={true}
				/>
			</div>

			{status && <p className="status-text">{status}</p>}

			<div className="conversation-history">
				<h4>Conversation History:</h4>
				{questionAnswers.map((qa, idx) => (
					<div key={idx} className={`qa-item ${idx === currentIndex ? "current" : ""}`}>
						<p>
							<strong>Q{idx + 1}:</strong> {qa.quest}
						</p>
						{qa.user_answer && (
							<p>
								<strong>Your Answer:</strong> {qa.user_answer}
							</p>
						)}
						{qa.expected_answer && (
							<p>
								<strong>Suggested:</strong> {qa.expected_answer}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ConversationFlow;

