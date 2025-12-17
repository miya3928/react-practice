
export default function Profile({ user }){
  // ユーザーがログインしていない場合
  if (!user) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-md">
        <p className="font-medium text-gray-600">
            👋 ログインしていません
        </p>
        <p className="text-xs text-gray-500 mt-1">
            ログインするとToDoリストが利用できます。
        </p>
      </div>
    );
  }
  // ユーザーがログインしている場合
  return(
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-indigo-700">マイプロフィール</h2>
      <div className="text-sm border-t pt-2">
        <p>
            <span className="font-medium text-gray-600">ユーザー名: </span>
            <span className="font-bold text-gray-800">{user.name}</span>
        </p>
        <p className="mt-1 text-gray-500">
            <span className="font-medium">職業: </span>開発学習者 (仮)
        </p>
      </div>
      <div className="text-sm border-t pt-2">
        <p>趣味: 漫画、ゲーム (仮データ)</p>
      </div>
    </div>
  );
}