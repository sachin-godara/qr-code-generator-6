import { Bell, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold tracking-tight">Create QR Code</h1>
      
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
