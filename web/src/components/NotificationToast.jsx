
import React, { useState, useEffect } from 'react';

export const NotificationToast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'from-green-600 to-emerald-600',
    error: 'from-red-600 to-rose-600',
    warning: 'from-yellow-600 to-orange-600',
    info: 'from-blue-600 to-purple-600'
  };

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className={`bg-gradient-to-r ${typeStyles[type]} px-6 py-4 rounded-lg shadow-2xl border border-white/20 flex items-center gap-3 max-w-md`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="text-white font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-auto text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
