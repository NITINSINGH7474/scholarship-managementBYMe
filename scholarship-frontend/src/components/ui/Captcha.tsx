import React, { useEffect, useState } from "react";
import Input from "./Input";

interface CaptchaProps {
    onVerify: (isValid: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        generateProblem();
    }, []);

    const generateProblem = () => {
        setNum1(Math.floor(Math.random() * 10));
        setNum2(Math.floor(Math.random() * 10));
        setUserAnswer("");
        onVerify(false);
        setTouched(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserAnswer(val);
        setTouched(true);

        const sum = num1 + num2;
        if (parseInt(val) === sum) {
            onVerify(true);
        } else {
            onVerify(false);
        }
    };

    const isValid = parseInt(userAnswer) === num1 + num2;

    return (
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-300 text-sm font-medium">Verify you are human:</span>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded text-indigo-300 font-bold tracking-widest font-mono select-none">
                    {num1} + {num2} = ?
                </div>
                <button
                    type="button"
                    onClick={generateProblem}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Refresh Captcha"
                >
                    ↻
                </button>
            </div>
            <div className="relative">
                <Input
                    type="number"
                    placeholder="Enter the sum"
                    value={userAnswer}
                    onChange={handleChange}
                    className={`w-full ${touched && isValid ? "border-green-500/50 focus:border-green-500" : ""}`}
                />
                {touched && isValid && (
                    <span className="absolute right-3 top-3 text-green-400">✓</span>
                )}
            </div>
        </div>
    );
}
