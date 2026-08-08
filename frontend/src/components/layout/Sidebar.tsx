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
            <div className="w-8 h-8 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                <defs>
                  <mask id="sidebar-logo-mask">
                    <rect width="100" height="100" fill="white"/>
                    <rect x="21" y="21" width="14" height="14" rx="4" fill="black"/>
                    <rect x="65" y="21" width="14" height="14" rx="4" fill="black"/>
                    <rect x="21" y="65" width="14" height="14" rx="4" fill="black"/>
                  </mask>
                </defs>
                <g mask="url(#sidebar-logo-mask)" fill="#7316f5">
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
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-[#df00ff] bg-clip-text text-transparent">GenerateCustomQR</span>
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
