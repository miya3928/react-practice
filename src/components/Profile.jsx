import { useState, useEffect } from "react";

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  // プロフィール項目のステート
  const [profileData, setProfileData] = useState({
    bio: "React学習中のエンジニアです。",
    goal: "モダンなポートフォリオを完成させる",
  });

  // localStorage から保存されたプロフィールを読み込む
  useEffect(() => {
    const saved = localStorage.getItem(`profile_${user?.name}`);
    if (saved) setProfileData(JSON.parse(saved));
  }, [user]);

  if (!user) return <p className="text-gray-500">ログインしてください</p>;

  const handleSave = () => {
    localStorage.setItem(`profile_${user.name}`, JSON.stringify(profileData));
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-indigo-700">マイカード</h2>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="text-xs bg-gray-100 hover:bg-blue-200 px-3 py-2 rounded border"
        >
          {isEditing ? "保存" : "編集"}
        </button>
      </div>

      <div className="text-sm space-y-3">
        <div>
          <label className="text-xs text-gray-600 block">名前</label>
          <p className="font-bold text-gray-800">{user.name}さん</p>
        </div>

        {isEditing ? (
          <>
            <div>
              <label className="text-xs text-gray-400 block">自己紹介</label>
              <textarea
                className="w-full border rounded p-1 text-sm "
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block">今後の目標</label>
              <input
                className="w-full border rounded p-1 text-sm"
                value={profileData.goal}
                onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-gray-600 block">自己紹介</label>
              <p className="text-gray-800 font-semibold whitespace-pre-wrap">{profileData.bio}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block">今後の目標</label>
              <p className="text-gray-800 font-semibold">{profileData.goal}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}