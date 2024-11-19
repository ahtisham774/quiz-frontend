import { memo, useEffect, useState } from "react"


const TimeLeft = memo(({ handleEnd, time }) => {
    const [timeLeft, setTimeLeft] = useState((time - 0) * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        if (timeLeft === 0) {
            clearInterval(interval);
            handleEnd();
        }

        return () => clearInterval(interval);
    }
        , [time]);




    return (
        <p className="text-xl"><span className="font-bold">Time Left: </span>
            {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </p>
    )
}
)

TimeLeft.displayName = "TimeLeft"

export default TimeLeft