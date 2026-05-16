import React from 'react';

interface ArticleProps {
    title: string;
    text: string;
    imageUrl: string;
}

export default function ArticleCard({ title, text, imageUrl }: ArticleProps) {
    return (
        <div className="border-4 border-[#064e7b] rounded-2xl overflow-hidden flex flex-col bg-white shrink-0 w-80">
            {/* Image Placeholder */}
            <div
                className="h-40 bg-gray-300 bg-cover bg-center"
                style={{ backgroundImage: `url('${imageUrl}')` }}
            ></div>
            <div className="p-6 flex-1">
                <h4 className="text-[#cc9945] font-bold text-sm mb-2">{title}</h4>
                <p className="text-xs font-bold text-gray-800 leading-relaxed">
                    {text}
                </p>
            </div>
        </div>
    );
}
