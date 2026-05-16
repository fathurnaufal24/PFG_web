import React from 'react';

interface TestimonialProps {
    name: string;
    text: string;
}

export default function TestimonialCard({ name, text }: TestimonialProps) {
    return (
        <div className="border-4 border-[#cc9945] rounded-2xl p-6 bg-white flex flex-col w-72 shrink-0">
            <div className="flex items-center gap-4 mb-4">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                    U
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 border-b border-gray-800 pb-1 inline-block">{name}</h4>
                    {/* Stars Placeholder */}
                    <div className="flex gap-1 mt-1 text-[#cc9945] text-sm">
                        ★★★★★
                    </div>
                </div>
            </div>
            <p className="text-sm font-bold text-gray-800 leading-relaxed">
                {text}
            </p>
        </div>
    );
}
