'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => { },
});

export const useToast = () => useContext(ToastContext);

const TOAST_DURATION = 4000;

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

const bgColors: Record<ToastType, string> = {
  success: 'linear-gradient(135deg, #059669, #10b981)',
  error: 'linear-gradient(135deg, #dc2626, #ef4444)',
  warning: 'linear-gradient(135deg, #d97706, #f59e0b)',
  info: 'linear-gradient(135deg, #2563eb, #3b82f6)',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        color: 'white',
        background: bgColors[toast.type],
        boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
        minWidth: '320px',
        maxWidth: '480px',
        animation: isExiting ? 'toastSlideOut 0.3s ease-in forwards' : 'toastSlideIn 0.3s ease-out forwards',
        backdropFilter: 'blur(8px)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      <div style={{ flexShrink: 0 }}>{icons[toast.type]}</div>
      <div style={{ flex: 1 }}>{toast.message}</div>
      <button
        onClick={handleDismiss}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none',
          }}
        >
          {toasts.map((toast) => (
            <div key={toast.id} style={{ pointerEvents: 'auto' }}>
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
