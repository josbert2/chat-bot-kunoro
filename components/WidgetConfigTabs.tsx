"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  icon: string;
};

const TABS: Tab[] = [
  { id: "appearance", label: "Apariencia", icon: "🎨" },
  { id: "messages", label: "Mensajes", icon: "💬" },
  { id: "behavior", label: "Comportamiento", icon: "⚙️" },
  { id: "installation", label: "Instalación", icon: "📦" },
];

type WidgetConfigTabsProps = {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export function WidgetConfigTabs({ children, activeTab: controlledTab, onTabChange }: WidgetConfigTabsProps) {
  const [internalTab, setInternalTab] = useState("appearance");
  const activeTab = controlledTab || internalTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>{children}</div>
    </div>
  );
}

type TabPanelProps = {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
};

export function TabPanel({ tabId, activeTab, children }: TabPanelProps) {
  if (tabId !== activeTab) return null;
  return <div className="animate-fade-in">{children}</div>;
}

