import React, { useState } from "react";
import Onboarding from "./Onboarding";
import ConversationFlow from "./ConversationFlow";
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
	onboardingAnswers: Record<string, string | string[]>;
}

function MainPage({
	user,
	onLogout,
	onPlay,
	onboardingDone,
	onOnboardingComplete,
	onboardingAnswers,
}: MainPageProps) {
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
							{/* <button className="primary play-btn" onClick={onPlay}>
								Play
							</button> */}
							<button className="secondary" onClick={onLogout}>
								Clear info
							</button>
						</div>
					</section>
					<ConversationFlow
						onboardingAnswers={onboardingAnswers}
						userProfile={user || {}}
					/>
				</>
			)}
		</div>
	);
}

export default MainPage;

