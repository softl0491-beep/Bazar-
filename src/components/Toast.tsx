interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#283044] text-[#eef0ff] px-4 py-2.5 rounded-full shadow-2xl font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/10 animate-fade-in transition-all">
      <span className="material-symbols-outlined text-[18px] text-[#85f8c4]">check_circle</span>
      <span>{message}</span>
    </div>
  );
}
