import Todo from "./Todo";

export default function Main() {
  return (
    <main style={{ padding: "20px" }}>
    <h2>メインコンテンツ</h2>

    <section>
      <h3>ToDo リスト</h3>
      <Todo />
    </section>
  </main>
  );
}