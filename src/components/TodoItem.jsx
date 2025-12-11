// TodoItem.jsx
import React from 'react';
import { motion } from 'framer-motion';


// 優先度表示用のスタイルヘルパー
const getPriorityStyles = (priority) => {
    switch (priority) {
        case 'high':
            return 'bg-red-500 text-white';
        case 'medium':
            return 'bg-yellow-500 text-gray-800';
        case 'low':
            return 'bg-green-500 text-white';
        default:
            return 'bg-gray-400 text-white';
    }
};

export default function TodoItem({
    todo,
    toggleDone,
    deleteTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    // 編集ステート（Todo.jsxからPropsとして渡される）
    editingId,
    editingText,
    setEditingText,
    editingPriority,
    setEditingPriority,
    editingDueDate,
    setEditingDueDate,
}) {
    // 優先度に応じたスタイル
    const priorityClasses = getPriorityStyles(todo.priority);
    // 現在のアイテムが編集対象か？
    const isEditing = editingId === todo.id;

    // 編集保存時のハンドラー (Todo.jsxのsaveEditをラップ)
    const handleSave = () => {
        // 必要に応じてここでバリデーションを追加可能
        if (editingText.trim() !== "") {
            saveEdit(todo.id);
        }
    };

    return (
      <motion.li
        // 🌟 アイテムがリストから削除されるときのアニメーション
        initial={{ opacity: 0, height: 0 }} // 初期状態（見えない）
        animate={{ opacity: 1, height: 'auto' }} // 表示された状態（見える）
        exit={{ opacity: 0, height: 0 }} // 削除されるとき（見えなくなる）
        layout // リストの他のアイテムが滑らかに移動するのを助ける
        className={`...`}
    >
        <section
            className={`transition duration-300 ease-in-out flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded ${
                todo.done ? "bg-gray-100 text-gray-400 opacity-70" : "bg-white shadow"
            }`}
        >
            {/* 🌟 編集モード 🌟 */}
            {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                    {/* 1. テキスト入力 */}
                    <input
                        className="flex-1 border rounded px-2 py-1 text-base"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                    />
                    {/* 2. 優先度と期日の編集 */}
                    <div className="flex gap-2 text-sm">
                        <select
                            value={editingPriority}
                            onChange={(e) => setEditingPriority(e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                        >
                            <option value="high">🔥 高</option>
                            <option value="medium">📝 中</option>
                            <option value="low">🌱 低</option>
                        </select>
                        <input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                        />
                    </div>

                    {/* 3. ボタン */}
                    <div className="flex gap-2 justify-end mt-2">
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            保存
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            ) : (
                // 🌟 表示モード 🌟
                <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* テキスト */}
                    <span className={`flex-1 font-medium text-gray-800 ${todo.done ? "line-through" : ""}`}>
                        {todo.text}
                    </span>

                    <div className="flex items-center gap-2 text-xs">
                        {/* 優先順位 */}
                        <span className={`px-2 py-0.5 rounded-full ${priorityClasses}`}>
                            {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                        </span>

                        {/* 期日 */}
                        {todo.dueDate && (
                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                📅 {todo.dueDate}
                            </span>
                        )}
                        {/* アクションボタン */}
                        <div className="flex gap-2 ml-4">
                             {/* 完了 toggle */}
                            <button
                                onClick={() => toggleDone(todo.id)}
                                disabled={isEditing}
                                className={`px-3 py-1 text-white rounded text-sm ${
                                    todo.done
                                        ? "bg-gray-500 hover:bg-gray-600"
                                        : "bg-green-500 hover:bg-green-600"
                                }`}
                            >
                                {todo.done ? "未完了" : "完了"}
                            </button>

                            {/* 編集 */}
                            {!todo.done && (
                                <button
                                    onClick={() => startEdit(todo)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                >
                                    編集
                                </button>
                            )}

                            {/* 削除 */}
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
      </motion.li>
    );
}