import Profile from "./Profile";
import Todo from "./Todo";


export default function Main() {
  return (
    <main style={{ padding: "20px" }}>
    <h2>メインコンテンツ</h2>
    <Profile />

    <section>
      <h1 className="text-center font-bold">ToDo リスト</h1>
      <Todo />
    </section>
  </main>
  );
}