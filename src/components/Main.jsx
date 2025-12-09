// Main.jsx
import Profile from "./Profile";
import Todo from "./Todo";

export default function Main({ className }) {
  return (
    <main className={`p-8 ${className}`}>
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl text-center font-semibold mb-6 text-gray-800">メインコンテンツ</h2>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. サイドバーエリア (md:col-span-1) */}
                <aside className="md:col-span-1 bg-white p-4 shadow rounded-lg h-fit">
                    <h3 className="text-xl font-medium mb-3">プロフィール</h3>
                    <Profile />
                </aside>
                <div className="md:col-span-2">
                    <h1 className="text-xl text-center font-bold mb-4">ToDo リスト</h1>
                    <Todo />
                </div>
            </section>

        </div>
    </main>
  );
}