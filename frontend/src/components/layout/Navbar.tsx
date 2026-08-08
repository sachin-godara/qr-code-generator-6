import { Bell, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <defs>
              <mask id="navbar-logo-mask">
                <rect width="100" height="100" fill="white"/>
                <rect x="21" y="21" width="14" height="14" rx="4" fill="black"/>
                <rect x="65" y="21" width="14" height="14" rx="4" fill="black"/>
                <rect x="21" y="65" width="14" height="14" rx="4" fill="black"/>
              </mask>
            </defs>
            <g mask="url(#navbar-logo-mask)" fill="#7316f5">
              <rect x="8" y="8" width="40" height="40" rx="12"/>
              <rect x="52" y="8" width="40" height="40" rx="12"/>
              <rect x="8" y="52" width="40" height="40" rx="12"/>
            </g>
            <g>
              <rect x="54" y="54" width="18" height="18" rx="6" fill="#7316f5"/>
              <rect x="54" y="76" width="12" height="12" rx="4" fill="#a471ff"/>
              <rect x="70" y="76" width="12" height="12" rx="4" fill="#7316f5"/>
            </g>
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-[#df00ff] bg-clip-text text-transparent">
          QR Code Maker
        </h1>
      </a>      
      <div className="flex items-center gap-4">
        <a 
          href="/qr-code-scanner" 
          className="text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
          Scan a Code
        </a>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-card"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
