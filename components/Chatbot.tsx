'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// Initialize AI Client
const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const SERVICE_PLANS = `
Planes de Servicio NexusCore:
1. Plan Básico: $50/mes. Incluye: Landing page optimizada, soporte básico WhatsApp.
2. Plan Crecimiento: $100/mes. Incluye: Todo el plan básico + automatización de seguimiento (CRM), integración de base de datos de clientes.
3. Plan Pro: $150/mes. Incluye: Todo el plan Crecimiento + gestión de campañas de tráfico (ads), consultoría de ventas mensual, soporte prioritario.
`;

const BASE_SYSTEM_PROMPT = `
Eres un asistente de ventas de alta conversión para NexusCore Tech. 
Tu objetivo es ayudar a dueños de Pymes en Venezuela a entender cómo nuestros servicios 
(página web, automatización, neuromarketing) aumentarán sus ventas. 

Sé directo, amable, profesional y enfocado en resultados. 
No menciones detalles técnicos complejos, enfócate en el beneficio (más ventas, más clientes, más organizado). 
Si el usuario pregunta por nuestros precios o servicios, preséntales estos planes:
${SERVICE_PLANS}
Pídeles que elijan uno para darles más detalles.

Si el usuario muestra interés real, tiene dudas complejas, o requiere una asesoría personalizada, invítalo firmemente a contactarnos por WhatsApp o agendar asesoría enviando un correo.

Mantén las respuestas cortas y precisas. No respondas temas fuera de servicios empresariales.
Si no puedes resolver la consulta, redirígelos a WhatsApp o correo.
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; buttons?: {label: string, value: string}[] }[]>([
    { role: 'assistant', text: '¡Hola! Soy el asistente de NexusCore Tech. ¿Cómo puedo ayudarte hoy a potenciar tu negocio?', buttons: [                
        { label: 'Ver Planes', value: 'planes' },
        { label: 'Consultoría', value: 'asesoría' }
    ] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState<{id: string, question: string, answer: string}[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('584249388632'); // Default
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubFaq = onSnapshot(collection(db, 'faqs'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {id: string, question: string, answer: string}));
      setFaqs(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'faqs');
    });

    const unsubSettings = onSnapshot(collection(db, 'settings'), (snapshot) => {
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        });
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'settings');
    });

    return () => { unsubFaq(); unsubSettings(); };
  }, []);

  const systemPrompt = useMemo(() => {
    return BASE_SYSTEM_PROMPT + `\n\nInformación de contacto:\nWhatsApp: +${whatsappNumber}\nEmail: digitalseller217@gmail.com\n\nPreguntas Frecuentes:\n` + faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join("\n");
  }, [faqs, whatsappNumber]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuickReply = async (value: string, label: string) => {
    setMessages(prev => [...prev, { role: 'user', text: label }]);
    await processMessage(value);
  };

  const processMessage = async (text: string) => {
    setIsLoading(true);
    let responseText = '';
    let buttons: {label: string, value: string}[] | undefined;

    if (text.toLowerCase().includes('planes')) {
        responseText = 'Aquí tienes nuestros planes. ¿Cuál te interesa para darte más detalles?';
        buttons = [
            { label: 'Plan Básico', value: 'detalles Plan Básico' },
            { label: 'Plan Crecimiento', value: 'detalles Plan Crecimiento' },
            { label: 'Plan Pro', value: 'detalles Plan Pro' }
        ];
    } else if (text.toLowerCase().includes('detalles')) {
        const plan = text.replace('detalles ', '');
        responseText = `Entendido, quieres saber más sobre el ${plan}. [Detalles del plan...] ¿Te gustaría agendar una asesoría gratuita?`;
        buttons = [
            { label: 'Sí, agendar ahora', value: 'agendar asesoría' },
            { label: 'No gracias', value: 'no' }
        ];
    } else {
        try {
            const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.text }],
                })),
                systemInstruction: systemPrompt
            });

            const result = await chat.sendMessage(text);
            responseText = result.response.text() ?? 'Lo siento, no pude procesar tu solicitud.';
        } catch (error) {
            console.error(error);
            responseText = 'Disculpa, tenemos problemas técnicos. Por favor, escríbenos directamente por WhatsApp.';
        }
    }

    setMessages(prev => [...prev, { role: 'assistant', text: responseText, buttons }]);
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    await processMessage(userMessage);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden dark:bg-slate-900 dark:border-slate-700"
          >
            <div className="bg-slate-950 p-4 flex justify-between items-center text-white">
              <span className="font-semibold">NexusCore Asistente</span>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'}`}>
                    {m.text}
                  </div>
                  {m.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                          {m.buttons.map(b => (
                              <button key={b.value} onClick={() => sendQuickReply(b.value, b.label)} className="text-xs bg-blue-100 text-blue-800 p-2 rounded-lg hover:bg-blue-200 transition dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                                  {b.label}
                              </button>
                          ))}
                      </div>
                  )}
                </div>
              ))}
              {isLoading && <div className="text-slate-500 text-sm">Escribiendo...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t flex gap-2 dark:border-slate-700">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded-lg p-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                placeholder="Escribe tu consulta..."
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-lg"><Send size={18} /></button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
