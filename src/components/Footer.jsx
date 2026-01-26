// src/components/Footer.jsx
export default function Footer({ className }) {
  return (
    <footer className={`p-4 bg-white border-t border-gray-100 ${className}`}>
      <p className="text-center text-gray-400 text-xs">
        © 2026 MY TODO
      </p>
    </footer>
  );
}