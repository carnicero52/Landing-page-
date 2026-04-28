'use client';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import SocialShare from '@/components/SocialShare';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import AnimatedCounter from '@/components/AnimatedCounter';
import AutomationCalculator from '@/components/AutomationCalculator';
import { ChevronRight, CheckCircle, BarChart, Zap, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { motion } from 'motion/react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    console.error(`Firestore Error [${operationType}] at ${path}:`, error);
    if (error && typeof error === 'object' && 'code' in error) {
        console.error(`Code: ${(error as any).code}`);
    }
}

const iconMapping: { [key: string]: React.ReactNode } = {
  target: <Target className="w-8 h-8 text-blue-600 dark:text-blue-400"/>,
  barChart: <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400"/>,
  zap: <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400"/>,
  checkCircle: <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400"/>,
};

export default function LandingPage() {
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/584249388632?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios');
  const [services, setServices] = useState<{ id: string, title: string, description: string, icon: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
        try {
            const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
            if (settingsSnap.exists()) {
                const data = settingsSnap.data();
                if (data.whatsappNumber) {
                    setWhatsappLink(`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(data.whatsappMessage || 'Hola, me gustaría más información sobre sus servicios')}`);
                }
            }
        } catch (error) {
            handleFirestoreError(error, OperationType.GET, 'settings/main');
        }

        try {
            const servicesSnap = await getDocs(collection(db, 'services'));
            setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, 'services');
        }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      {/* Hero */}
      <motion.section 
        id="hero"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-slate-950 text-white text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Aumenta tus ventas con un sistema <br/>que trabaja por ti</h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Creamos páginas web y automatizamos tu negocio para atraer y convertir más clientes.</p>
        <div className="flex gap-4 justify-center">
            <a href="#contacto" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition">Solicitar asesoría gratuita</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-950 px-8 py-4 rounded-full font-semibold hover:bg-slate-200 transition">Escríbenos por WhatsApp</a>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section 
        id="benefits"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 bg-white px-6 dark:bg-slate-950"
      >
        <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center">¿Por qué elegir NexusCore Tech?</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 text-center">
                {[
                    { label: 'Años de experiencia', value: 5 },
                    { label: 'Proyectos completados', value: 50 },
                    { label: 'Clientes felices', value: 40 },
                ].map((stat) => (
                    <div key={stat.label}>
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                             +<AnimatedCounter value={stat.value} />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    {title: 'Ahorro de Tiempo', desc: 'Automatizamos tareas repetitivas para que te enfoques en crecer.', icon: <Zap className="w-10 h-10 text-green-600 dark:text-green-400"/>},
                    {title: 'Más Conversiones', desc: 'Diseños enfocados en guiar a tu cliente a la compra.', icon: <Target className="w-10 h-10 text-green-600 dark:text-green-400"/>},
                    {title: 'Data Real', desc: 'Analizamos el comportamiento para mejorar constantemente.', icon: <BarChart className="w-10 h-10 text-green-600 dark:text-green-400"/>},
                    {title: 'Seguridad Digital', desc: 'Protegemos tu información y la de tus clientes.', icon: <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400"/>},
                ].map(b => (
                    <div key={b.title} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center dark:bg-slate-800 dark:border-slate-700">
                        <div className="mb-4 flex justify-center">{b.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{b.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </motion.section>

      {/* Problem */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 px-6 max-w-5xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">¿Tu negocio se siente estancado?</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {['No llegan suficientes clientes', 'Se pierden ventas por falta de seguimiento', 'Procesos manuales y desorganizados', 'Dependencia total de redes sociales'].map(p => (
                <div key={p} className="flex items-center gap-4 p-6 bg-slate-50 rounded-xl border dark:bg-slate-800 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">X</div>
                    <p className="text-lg font-medium">{p}</p>
                </div>
            ))}
        </div>
      </motion.section>

      {/* Services */}
      <motion.section 
        id="services"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 bg-slate-100 px-6 dark:bg-slate-900"
      >
        <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center">Nuestras soluciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {services.map(s => (
                    <motion.div 
                        key={s.id} 
                        whileHover={{ y: -8 }}
                        className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 dark:bg-slate-800 dark:border-slate-700"
                    >
                        <div className="mb-6 inline-block p-4 bg-blue-50 rounded-full dark:bg-blue-900/30">{iconMapping[s.icon] || iconMapping.target}</div>
                        <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                        <p className="text-slate-600 leading-relaxed dark:text-slate-400">{s.description}</p>
                    </motion.div>
                ))}
            </div>
            <div className="mt-16 text-center">
                <a href="#contacto" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition">Solicitar asesoría gratuita</a>
            </div>
        </div>
      </motion.section>

      <AutomationCalculator />

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 bg-slate-900 text-white px-6"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Historias de Éxito</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {name: 'María G.', rol: 'Dueña de Boutique', quote: 'NexusCore automatizó mis ventas y el tiempo de respuesta mejoró notablemente.'},
              {name: 'Carlos R.', rol: 'Consultor', quote: 'La página que me hicieron es mi mejor herramienta de captación.'},
              {name: 'Ana L.', rol: 'E-commerce', quote: 'Ahora tengo mis procesos claros y mis clientes felices.'},
            ].map(t => (
              <div key={t.name} className="p-8 bg-slate-800 rounded-2xl border border-slate-700">
                 <p className="text-lg italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl">{t.name[0]}</div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-slate-400 text-sm">{t.rol}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Us */}
      <motion.section 
        id="about"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 px-6 max-w-5xl mx-auto text-center"
      >
          <h2 className="text-4xl font-bold mb-8">Acerca de Nosotros</h2>
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
            <p>En NexusCore Tech, nuestra misión es democratizar el acceso a la tecnología avanzada para negocios emergentes, permitiéndoles competir en el mercado actual.</p>
            <p>Valoramos la innovación, la transparencia y el éxito compartido con cada uno de nuestros clientes.</p>
            <p>Nos encontramos ubicados en <strong>Ciudad Bolivar, Venezuela</strong>, listos para atenderte.</p>
          </div>
      </motion.section>

      {/* Pricing */}
      <motion.section 
        id="pricing"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-16 text-center">Planes adaptados a tu crecimiento</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {[
                {name: 'Plan Básico', price: '$120 – $180', desc: 'Landing page + WhatsApp + presencia profesional'},
                {name: 'Plan Crecimiento', price: '$250 – $400', desc: 'Página optimizada + estructura de ventas + automatización básica'},
                {name: 'Plan Pro', price: '$500 – $900', desc: 'Sistema completo + automatización + asesoría estratégica'},
            ].map(p => (
                <div key={p.name} className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col dark:bg-slate-800 dark:border-slate-700">
                    <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                    <p className="text-4xl font-bold mb-6">{p.price}</p>
                    <p className="text-slate-600 mb-8 flex-1 dark:text-slate-400">{p.desc}</p>
                    <button className="w-full bg-slate-950 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">Elegir plan</button>
                </div>
            ))}
        </div>
        <p className="text-center mt-12 text-lg text-slate-700 font-medium dark:text-slate-400">Servicio mensual: $50 – $150 / mes. <br/>&#39;Recupera tu inversión con pocas ventas adicionales&#39;.</p>
      </motion.section>

      <SocialShare />

      {/* Contact */}
      <motion.section 
        id="contacto"
        className="py-20 bg-slate-100 text-center px-6 dark:bg-slate-900"
      >
        <h2 className="text-4xl font-bold mb-6">¿Listo para transformar tu negocio?</h2>
        <p className="text-xl mb-10 dark:text-slate-400">Agenda una llamada hoy y descubramos cómo podemos ayudarte.</p>
        
        <form className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg dark:bg-slate-800 text-left space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Formulario enviado (simulado)'); }}>
            <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" required className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-700" placeholder="Tu nombre" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                <input type="email" required className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-700" placeholder="tu@email.com" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">¿Qué servicio te interesa?</label>
                <select className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-700">
                    <option value="">Selecciona un servicio</option>
                    {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mensaje</label>
                <textarea rows={4} className="w-full p-3 rounded-lg border dark:bg-slate-950 dark:border-slate-700" placeholder="Cuéntanos sobre tu proyecto"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Enviar mensaje</button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition">Contactar por WhatsApp</a>
          <a href="mailto:digitalseller217@gmail.com" className="inline-block bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400 dark:border-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-blue-600">Envíanos un correo</a>
        </div>
      </motion.section>

      <Chatbot />
      <ScrollToTopButton />
    </main>
  );
}
