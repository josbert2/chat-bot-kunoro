import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bookforce AI Chatbot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tu asistente virtual inteligente tipo Intercom
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ¿Cómo funciona?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Chat Inteligente
                </h3>
                <p className="text-gray-600 text-sm">
                  Haz preguntas y recibe respuestas instantáneas con IA
                </p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Respuestas Precisas
                </h3>
                <p className="text-gray-600 text-sm">
                  Información contextual sobre Bookforce
                </p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Disponible 24/7
                </h3>
                <p className="text-gray-600 text-sm">
                  Asistencia inmediata en cualquier momento
                </p>
              </div>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              ¡Prueba el chatbot ahora!
            </h2>
            <p className="text-lg mb-4">
              Haz clic en el botón flotante en la esquina inferior derecha 👉
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                💡 Pregunta sobre Bookforce
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                🎫 Consulta sobre eventos
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                📅 Información de reservas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  );
}
