import { Bell, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold tracking-tight">Create QR Code</h1>
      
      <div className="flex items-center gap-4">
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
