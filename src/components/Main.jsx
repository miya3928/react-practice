export default function Main({ children, className }) {
  return (
    <main className={`p-4 md:p-8 ${className}`}>
        {/* 幅を広げて、左右に並ぶスペースを確保 */}
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-center font-bold mb-8 text-gray-400 uppercase tracking-[0.2em]">
                Workspace
            </h2>
            <section>{children}</section>
        </div>
    </main>
  );
}