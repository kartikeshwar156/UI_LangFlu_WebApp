import React, { useState } from "react";
import Onboarding from "./Onboarding";
import QuestionRecorder from "./QuestionRecorder";
import "./MainPage.css";

interface UserProfile {
	name?: string;
	email?: string;
	picture?: string;
}

interface MainPageProps {
	user?: UserProfile;
	onLogout?: () => void;
	onPlay?: () => void;
	onboardingDone: boolean;
	onOnboardingComplete: (ans: Record<string, string | string[]>) => void;
}

function MainPage({
	user,
	onLogout,
	onPlay,
	onboardingDone,
	onOnboardingComplete,
}: MainPageProps) {
	const [transcript, setTranscript] = useState("");
	const question =
		"Do you agree with the statement: I know exactly what to say in my head, but can't find the right words?";

	return (
		<div className="main-page">
			<header className="topbar">
				<div className="user-badge">
					{user?.picture && (
						<img src={user.picture} alt="avatar" className="avatar small" />
					)}
					<span className="user-name">{user?.name}</span>
				</div>
			</header>

			{!onboardingDone ? (
				<Onboarding
					onComplete={(ans) => {
						onOnboardingComplete(ans);
					}}
				/>
			) : (
				<>
					<section className="hero">
						<img
							src="/Male_Profile_image.png"
							alt="Profile icon"
							className="hero-image"
						/>
						<div className="actions">
							<button className="primary play-btn" onClick={onPlay}>
								Play
							</button>
							<button className="secondary" onClick={onLogout}>
								Clear info
							</button>
						</div>
						<div className="question-block">
							<p className="hint">{question}</p>
							<QuestionRecorder
								question={question}
								onTranscript={(text) => setTranscript(text)}
							/>
							{transcript && (
								<p className="hint">
									Transcript: <strong>{transcript}</strong>
								</p>
							)}
						</div>
					</section>
				</>
			)}
		</div>
	);
}

export default MainPage;

