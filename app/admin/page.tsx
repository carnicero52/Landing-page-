'use client';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/components/FirebaseProvider';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminPage() {
  const { user, loading } = useFirebase();
  const [faqs, setFaqs] = useState<{id: string, question: string, answer: string}[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
        const unsub = onSnapshot(collection(db, 'faqs'), (snapshot) => {
            setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {id: string, question: string, answer: string})));
        });
        getDoc(doc(db, 'settings', 'main')).then(snap => {
            if (snap.exists()) {
                const data = snap.data();
                setWhatsappNumber(data.whatsappNumber || '');
                setWhatsappMessage(data.whatsappMessage || '');
                setEmail(data.email || '');
                setAddress(data.address || '');
            }
        });
        return () => unsub();
    }
  }, [user]);

  const addFAQ = async () => {
      if (!newQuestion || !newAnswer) return;
      await addDoc(collection(db, 'faqs'), { question: newQuestion, answer: newAnswer });
      setNewQuestion('');
      setNewAnswer('');
  };

  const deleteFAQ = async (id: string) => {
      await deleteDoc(doc(db, 'faqs', id));
  };
  
  const saveSettings = async () => {
      await setDoc(doc(db, 'settings', 'main'), { 
          title: "NexusCore Tech", 
          description: "Tu socio tecnológico", 
          whatsappNumber, 
          whatsappMessage,
          email,
          address
      });
      alert('Configuración guardada');
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button onClick={async () => {
          try {
            await signInWithPopup(auth, new GoogleAuthProvider());
          } catch (err) {
            alert('Error al iniciar sesión con Google');
          }
        }} className="bg-blue-600 text-white p-4 rounded-lg">
          Iniciar sesión como Admin (Google)
        </button>
      </div>
    );
  }


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Configuración NexusCore</h1>
      <p className="mb-8">Bienvenido, {user.email}.</p>
      
      <div className="border p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">Configuración General</h2>
          <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="Número de WhatsApp (ej: 584121234567)" className="w-full mb-2 p-2 border rounded"/>
          <textarea value={whatsappMessage} onChange={e => setWhatsappMessage(e.target.value)} placeholder="Mensaje predeterminado" className="w-full mb-2 p-2 border rounded"/>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full mb-2 p-2 border rounded"/>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Dirección" className="w-full mb-2 p-2 border rounded"/>
          <button onClick={saveSettings} className="bg-blue-600 text-white p-2 rounded">Guardar Cambios</button>
      </div>

      <div className="border p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">Añadir FAQ</h2>
          <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Pregunta" className="w-full mb-2 p-2 border rounded"/>
          <textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="Respuesta" className="w-full mb-2 p-2 border rounded"/>
          <button onClick={addFAQ} className="bg-green-600 text-white p-2 rounded">Añadir</button>
      </div>

      <h2 className="text-xl font-bold mb-4">FAQs Actuales</h2>
      {faqs.map(faq => (
          <div key={faq.id} className="p-4 border-b flex justify-between items-center">
              <div>
                  <p className="font-bold">{faq.question}</p>
                  <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
              <button onClick={() => deleteFAQ(faq.id)} className="text-red-500">Eliminar</button>
          </div>
      ))}
    </div>
  );
}
