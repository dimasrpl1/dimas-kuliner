export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto py-10 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Brand */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">DimasKuliner</h3>
          <div className="w-14 h-1 bg-green-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600 mb-6">
          <div>
            <p className="font-semibold text-gray-700">Telepon</p>
            <p>+62 812-3456-7890</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Email</p>
            <p>info@dimaskuliner.com</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Alamat</p>
            <p>Jl. Raya Kuliner No. 123, Jakarta</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 mb-6">
          {[
            { href: '#', label: 'Instagram', color: 'text-pink-500' },
            { href: '#', label: 'Facebook', color: 'text-blue-600' },
            { href: '#', label: 'Twitter', color: 'text-blue-400' },
          ].map((icon, idx) => (
            <a
              key={idx}
              href={icon.href}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-lg transition transform hover:scale-110"
              aria-label={icon.label}
            >
              <div className={`w-5 h-5 ${icon.color}`}>
                {/* You can swap these with actual icon components */}
                <span className="block w-full h-full bg-current rounded-full" />
              </div>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} DimasKuliner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
