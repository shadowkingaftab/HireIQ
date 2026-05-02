export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary animate-spin"></div>
          </div>
        </div>
      </div>
      <p className="text-gray-600 font-bold text-sm uppercase tracking-widest animate-pulse">Analyzing your skills...</p>
    </div>
  );
}
