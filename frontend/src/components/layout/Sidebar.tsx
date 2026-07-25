import { LayoutDashboard, QrCode, Settings, History, HelpCircle } from "lucide-react"

export function Sidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: QrCode, label: "Create QR", active: true },
    { icon: History, label: "History", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card h-screen flex flex-col justify-between hidden md:flex">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">QRStream</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {items.map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-primary' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </button>
      </div>
    </aside>
  )
}
