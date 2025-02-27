// import { useState } from 'react'
import './App.css';
// import SpeedTypingGame from "./components/SpeedTimingGame.jsx";
import TimerHeading from './components/TimerHeading';

function App() {
	return (
		<>
			<div className='@container w-full p-10 flex items-center justify-center'>
				<div className='grid grid-rows-6 gap-2'>
					<TimerHeading heading='Typing Speed Calculator' />
				</div>
			</div>
		</>
	);
}

export default App;
