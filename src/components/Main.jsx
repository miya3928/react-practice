import Profile from "./Profile";
import Todo from "./Todo";


export default function Main() {
  return (
    <main style={{ padding: "20px" }}>
      <h1 className="text-4xl font-bold text-red-500">TEST</h1>
      <h1 className="text-5xl text-blue-600 bg-yellow-200 p-4">
  Tailwind OK!!
</h1>
    <h2>メインコンテンツ</h2>
    <Profile />

    <section>
      <h3>ToDo リスト</h3>
      <Todo />
    </section>
  </main>
  );
}