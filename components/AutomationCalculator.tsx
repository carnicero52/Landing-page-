'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, DollarSign, Zap } from 'lucide-react';

export default function AutomationCalculator() {
    const [hoursPerDay, setHoursPerDay] = useState(2);
    
    // Assumptions:
    // 1 month = 20 workdays
    // Hourly rate = $10 (conservative estimate for small busines owner time value)
    const hoursSavedPerMonth = hoursPerDay * 20;
    const estimatedValueSaved = hoursSavedPerMonth * 10;

    return (
        <section className="py-20 bg-slate-50 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold mb-8 text-center">Calculadora de Ahorro por Automatización</h2>
                
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <label className="block text-lg font-semibold mb-3">
                            Horas diarias dedicadas a tareas repetitivas
                        </label>
                        <input 
                            type="range" 
                            min="1" 
                            max="8" 
                            value={hoursPerDay} 
                            onChange={(e) => setHoursPerDay(Number(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="text-4xl font-bold text-blue-600 mt-4">{hoursPerDay} horas/día</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-blue-50 rounded-2xl">
                            <Clock className="w-8 h-8 text-blue-600 mb-2"/>
                            <div className="text-2xl font-bold">{hoursSavedPerMonth}</div>
                            <p className="text-sm text-slate-600">Horas ahorradas al mes</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-2xl">
                            <DollarSign className="w-8 h-8 text-green-600 mb-2"/>
                            <div className="text-2xl font-bold">${estimatedValueSaved}</div>
                            <p className="text-sm text-slate-600">Valor mensual ahorrado</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 text-center p-6 bg-slate-950 text-white rounded-xl">
                    <Zap className="inline-block w-8 h-8 text-yellow-400 mb-3"/>
                    <h3 className="text-xl font-bold mb-2">¡Recupera tu tiempo!</h3>
                    <p className="text-slate-300">Nuestros sistemas de automatización pueden recuperar esas {hoursSavedPerMonth} horas para que las inviertas en cerrar más ventas.</p>
                </div>
            </div>
        </section>
    );
}
