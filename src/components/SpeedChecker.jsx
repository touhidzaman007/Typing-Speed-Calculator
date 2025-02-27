const SpeedChecker = ({
	typingText,
	inpFieldValue,
	timeLeft,
	mistakes,
	WPM,
	CPM,
	initTyping,
	handleStartBtn,
	resetGame,
}) => {
	return (
		<div className="w-full flex items-center justify-between p-6">
			<div className="w-40 h-40">
				{WPM}
				<p>WPM</p>
			</div>
			<div className="w-40 h-40">
				{CPM}
				<p>CPM</p>
			</div>
			<div className="w-40 h-40">
				0%
				<p>Accuracy</p>
			</div>
			<div className="w-40 h-40">
				{mistakes}
				<p>Errors</p>
			</div>
		</div>
	);
};

export default SpeedChecker;
