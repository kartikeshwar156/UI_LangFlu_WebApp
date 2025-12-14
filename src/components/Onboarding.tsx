import { useMemo } from "react";
import React, { useState } from "react";
import "./Onboarding.css";

type Option = {
	label: string;
	value: string;
};

type Question = {
	id: string;
	title: string;
	description?: string;
	options: Option[];
	multiple?: boolean;
};

type Answers = Record<string, string | string[]>;

type OnboardingProps = {
	onComplete: (answers: Answers) => void;
};

const questions: Question[] = [
	{
		id: "confidence",
		title: "Do you agree with the statement below?",
		description: "I know exactly what to say in my head, but can't find the right words.",
		options: [
			{ label: "No", value: "no" },
			{ label: "Maybe", value: "maybe" },
			{ label: "Yes", value: "yes" },
		],
	},
	// {
	// 	id: "goal",
	// 	title: "What is your main goal for improving your English?",
	// 	options: [
	// 		{ label: "Speak confidently at work", value: "work_confidence" },
	// 		{ label: "Find a new job", value: "new_job" },
	// 		{ label: "Live comfortably abroad", value: "abroad" },
	// 		{ label: "Travel with ease", value: "travel" },
	// 		{ label: "Expand my skills", value: "skills" },
	// 		{ label: "Connect with family & friends", value: "family" },
	// 	],
	// },
	// {
	// 	id: "age",
	// 	title: "What is your age?",
	// 	description: "Each age learns differently. We'll adapt your practice to work best for you.",
	// 	options: [
	// 		{ label: "<24", value: "<24" },
	// 		{ label: "25-34", value: "25-34" },
	// 		{ label: "35-44", value: "35-44" },
	// 		{ label: "45-54", value: "45-54" },
	// 		{ label: "55-64", value: "55-64" },
	// 		{ label: "65+", value: "65+" },
	// 	],
	// },
	// {
	// 	id: "feel",
	// 	title: "How do you feel when you need to speak English?",
	// 	options: [
	// 		{ label: "I get anxious and start sweating", value: "anxious" },
	// 		{ label: "I freeze and forget words", value: "freeze" },
	// 		{ label: "I avoid speaking if possible", value: "avoid" },
	// 		{ label: "I speak, but feel embarrassed", value: "embarrassed" },
	// 		{ label: "I feel confident enough", value: "confident" },
	// 	],
	// },
	// {
	// 	id: "challenges",
	// 	title: "What are the main challenges for you in learning English?",
	// 	description: "Select all that apply",
	// 	multiple: true,
	// 	options: [
	// 		{ label: "Finding time", value: "time" },
	// 		{ label: "Staying motivated", value: "motivation" },
	// 		{ label: "Few chances to speak", value: "chances" },
	// 		{ label: "Remembering lessons", value: "memory" },
	// 		{ label: "Feeling nervous speaking", value: "nervous" },
	// 		{ label: "English feels too hard", value: "hard" },
	// 		{ label: "No struggle — I’m doing great!", value: "great" },
	// 	],
	// },
	// {
	// 	id: "gender",
	// 	title: "What is your gender?",
	// 	options: [
	// 		{ label: "Male", value: "male" },
	// 		{ label: "Female", value: "female" },
	// 	],
	// },
	// {
	// 	id: "hardest",
	// 	title: "What's the hardest part of speaking English for you?",
	// 	options: [
	// 		{ label: "Starting conversations", value: "start" },
	// 		{ label: "Maintaining natural flow", value: "flow" },
	// 		{ label: "Finding right words quickly", value: "words" },
	// 		{ label: "Understanding different accents", value: "accents" },
	// 		{ label: "Expressing complex thoughts", value: "complex" },
	// 	],
	// },
	// {
	// 	id: "level",
	// 	title: "What's your current language level?",
	// 	options: [
	// 		{ label: "Beginner (A1-A2)", value: "beginner" },
	// 		{ label: "Intermediate (B1)", value: "intermediate" },
	// 		{ label: "Upper-Intermediate (B2)", value: "upper_intermediate" },
	// 		{ label: "Advanced (C1-C2)", value: "advanced" },
	// 	],
	// },
	// {
	// 	id: "improving",
	// 	title: "How are you currently improving your English?",
	// 	description: "Select all that apply",
	// 	multiple: true,
	// 	options: [
	// 		{ label: "Classes or courses", value: "classes" },
	// 		{ label: "Learning apps", value: "apps" },
	// 		{ label: "Videos or movies", value: "videos" },
	// 		{ label: "Podcasts or audiobooks", value: "podcasts" },
	// 		{ label: "Speaking with others", value: "speaking" },
	// 		{ label: "Not learning right now", value: "not_learning" },
	// 	],
	// },
	// {
	// 	id: "statement",
	// 	title: "Do you agree with the statement below?",
	// 	description: "I feel uncomfortable speaking English because I don't practice enough.",
	// 	options: [
	// 		{ label: "No", value: "no" },
	// 		{ label: "Maybe", value: "maybe" },
	// 		{ label: "Yes", value: "yes" },
	// 	],
	// },
	// {
	// 	id: "daily_use",
	// 	title: "How do you use English in your daily life?",
	// 	description: "Select all that apply",
	// 	multiple: true,
	// 	options: [
	// 		{ label: "Read English news", value: "news" },
	// 		{ label: "Watch English shows", value: "shows" },
	// 		{ label: "Listen to English music", value: "music" },
	// 		{ label: "Use English at work", value: "work" },
	// 		{ label: "Chat with English speakers", value: "chat" },
	// 		{ label: "Rarely use English", value: "rare" },
	// 	],
	// },
	// {
	// 	id: "improve_most",
	// 	title: "What part of your English do you want to improve the most?",
	// 	options: [
	// 		{ label: "Speaking with confidence", value: "confidence" },
	// 		{ label: "Improving pronunciation", value: "pronunciation" },
	// 		{ label: "Expanding vocabulary", value: "vocabulary" },
	// 		{ label: "Using grammar correctly", value: "grammar" },
	// 		{ label: "Understanding native speakers", value: "native" },
	// 		{ label: "Writing more fluently", value: "writing" },
	// 	],
	// },
	// {
	// 	id: "field",
	// 	title: "What field do you work in?",
	// 	options: [
	// 		{ label: "Tech & Engineering", value: "tech" },
	// 		{ label: "Business & Finance", value: "business" },
	// 		{ label: "Students & Education", value: "education" },
	// 		{ label: "Creative & Media", value: "creative" },
	// 		{ label: "Services & Skilled Jobs", value: "services" },
	// 		{ label: "Marketing & Sales", value: "marketing" },
	// 		{ label: "Healthcare & Science", value: "health" },
	// 		{ label: "Currently unemployed", value: "unemployed" },
	// 		{ label: "Other Fields", value: "other" },
	// 	],
	// },
];

const Onboarding = ({ onComplete }: OnboardingProps) => {
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});

	const current = questions[step];
	const progress = useMemo(
		() => Math.round(((step + 1) / questions.length) * 100),
		[step]
	);

	const handleSelect = (value: string) => {
		setAnswers((prev) => {
			if (current.multiple) {
				const existing = (prev[current.id] as string[]) || [];
				const exists = existing.includes(value);
				const next = exists ? existing.filter((v) => v !== value) : [...existing, value];
				return { ...prev, [current.id]: next };
			}
			return { ...prev, [current.id]: value };
		});
	};

	const canGoNext = () => {
		const val = answers[current.id];
		if (!val) return false;
		if (Array.isArray(val)) return val.length > 0;
		return true;
	};

	const next = () => {
		if (step < questions.length - 1) {
			setStep((s) => s + 1);
		}
	};

	const prev = () => {
		if (step > 0) {
			setStep((s) => s - 1);
		}
	};

	return (
		<div className="onboarding">
			<div className="onboarding-header">
				<button className="ghost" onClick={prev} disabled={step === 0}>
					← Back
				</button>
				<div className="progress">
					<div className="progress-bar" style={{ width: `${progress}%` }} />
				</div>
				<span className="step">
					{step + 1}/{questions.length}
				</span>
			</div>

			<div className="question-card">
				<h2>{current.title}</h2>
				{current.description && <p className="description">{current.description}</p>}

				<div className="options">
					{current.options.map((opt) => {
						const val = answers[current.id];
						const selected = Array.isArray(val)
							? val.includes(opt.value)
							: val === opt.value;
						return (
							<button
								key={opt.value}
								className={`option ${selected ? "selected" : ""}`}
								onClick={() => handleSelect(opt.value)}
							>
								{opt.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="actions">
				<button className="ghost" onClick={prev} disabled={step === 0}>
					Previous
				</button>
				{step < questions.length - 1 ? (
					<button className="primary" onClick={next} disabled={!canGoNext()}>
						Next
					</button>
				) : (
					<button
						className="primary"
						disabled={!canGoNext()}
						onClick={() => onComplete(answers)}
					>
						Done
					</button>
				)}
			</div>

			{/* <pre className="answers-preview">
				{/* For debugging / saving later; remove or style as needed */}
			{/* {JSON.stringify(answers, null, 2)} */}
			{/* </pre> */}
		</div>
	);
};

export default Onboarding;

