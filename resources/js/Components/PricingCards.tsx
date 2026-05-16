import React from 'react';

interface PricingProps {
    title: string;
    subtitle: string;
    originalPrice: string;
    price: string;
    discount: string;
    features: string[];
    isPopular?: boolean;
}

export default function PricingCard({ title, subtitle, originalPrice, price, discount, features, isPopular = false }: PricingProps) {
    return (
        <div className={`relative bg-white rounded-3xl p-8 flex flex-col ${isPopular ? 'border-4 border-[#cc9945] shadow-xl' : 'border border-gray-200 shadow-sm mt-8'}`}>
            {isPopular && (
                <div className="absolute top-0 left-0 w-full bg-[#cc9945] text-white text-center py-2 rounded-t-2xl font-bold -mt-1">
                    Terpopuler
                </div>
            )}

            <div className={`flex justify-end ${isPopular ? 'mt-8' : ''}`}>
                <span className="bg-[#064e7b] text-white text-xs font-bold px-3 py-1 rounded-full">
                    DISKON {discount}
                </span>
            </div>

            <h3 className="text-xl font-bold mt-4">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

            <div className="mb-6">
                <span className="text-sm text-gray-400 line-through block">{originalPrice}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold">Rp</span>
                    <span className="text-4xl font-extrabold">{price}</span>
                    <span className="text-sm text-gray-500">/bln</span>
                </div>
                <p className="text-[#cc9945] text-sm font-bold mt-2">+2 bulan gratis</p>
            </div>

            <button className={`w-full py-3 rounded-lg font-bold border ${isPopular ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-400 hover:bg-gray-50'}`}>
                Pilih paket
            </button>

            <div className="mt-8 space-y-3 flex-1">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 font-bold">✓</span>
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </div>
                ))}
            </div>
        </div>
    );
}
