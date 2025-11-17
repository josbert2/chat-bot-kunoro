"use client";

import { useState } from "react";

type Props = {
  appId: string;
  siteName: string;
};

export function WidgetInstallation({ appId, siteName }: Props) {
  const [copied, setCopied] = useState(false);

  const snippet = `<!-- Bookforce Chat Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['BookforceWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','bookforce','https://cdn.bookforce.io/widget.js'));
  bookforce('init', '${appId}');
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">Instalar el widget en tu sitio</h4>
        <p className="text-[11px] text-slate-500">
          Copia y pega este código justo antes del cierre de la etiqueta <code className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">&lt;/body&gt;</code> en tu sitio web.
        </p>
      </div>

      {/* Site info */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Sitio</p>
          <p className="text-sm font-medium text-slate-900">{siteName}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">App ID</p>
          <p className="text-sm font-mono text-slate-900">{appId}</p>
        </div>
      </div>

      {/* Code snippet */}
      <div className="relative">
        <pre className="rounded-lg border border-slate-200 bg-slate-900 p-4 overflow-x-auto text-xs text-slate-100 font-mono leading-relaxed">
          {snippet}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-700 border border-slate-700"
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>

      {/* Platform guides */}
      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-slate-900">Guías de instalación por plataforma</h5>
        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <span>WordPress</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <span>Shopify</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <span>Wix</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <span>HTML Personalizado</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Testing */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <span className="text-lg">💡</span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-900">Prueba tu widget</p>
            <p className="text-[11px] text-blue-700">
              Después de instalar el código, recarga tu sitio web y busca el botón flotante en la esquina. 
              Puedes probarlo enviando un mensaje y verificando que aparezca en tu inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

