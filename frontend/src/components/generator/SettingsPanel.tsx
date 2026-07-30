import { useState } from "react"
import { useQRStore } from "@/store/useQRStore"
import { 
  Link2, Type, Phone, MessageSquare, MessageCircle, Mail, Contact, 
  Wifi, MapPin, Calendar, Landmark, Bitcoin, CreditCard, Smartphone, PlayCircle, Share2 
} from "lucide-react"
import {
  UrlForm, TextForm, PhoneForm, SmsForm, WhatsAppForm, EmailForm, VCardForm,
  WifiForm, LocationForm, EventForm, UpiForm, CryptoForm, PaypalForm,
  AppStoreForm, GooglePlayForm, SocialForm
} from "./forms/ContentForms"

export function SettingsPanel() {
  const { settings, updateSettings } = useQRStore()
  const [activeCorner, setActiveCorner] = useState<"all" | "tl" | "tr" | "bl">("all")

  const contentCategories = [
    {
      title: "🌍 Basic",
      items: [
        { id: "url", label: "URL", icon: Link2 },
        { id: "text", label: "Text", icon: Type },
        { id: "phone", label: "Phone", icon: Phone },
        { id: "sms", label: "SMS", icon: MessageSquare },
        { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
        { id: "email", label: "Email", icon: Mail },
        { id: "vcard", label: "vCard", icon: Contact },
      ]
    },
    {
      title: "📶 Network",
      items: [
        { id: "wifi", label: "Wi-Fi", icon: Wifi },
      ]
    },
    {
      title: "📍 Location",
      items: [
        { id: "location", label: "Location", icon: MapPin },
      ]
    },
    {
      title: "📅 Events",
      items: [
        { id: "event", label: "Event", icon: Calendar },
      ]
    },
    {
      title: "💳 Payments",
      items: [
        { id: "upi", label: "UPI", icon: Landmark },
        { id: "crypto", label: "Crypto", icon: Bitcoin },
        { id: "paypal", label: "PayPal", icon: CreditCard },
      ]
    },
    {
      title: "📱 Apps",
      items: [
        { id: "appstore", label: "App Store", icon: Smartphone },
        { id: "googleplay", label: "Google Play", icon: PlayCircle },
      ]
    },
    {
      title: "🌐 Social",
      items: [
        { id: "social", label: "Social Profiles", icon: Share2 },
      ]
    }
  ]

  const dotStyles = [
    // Normal
    "square", "circle", "rounded", "diamond", "hexagon", "octagon",
    // Intermediate
    "gapped", "star", "heart", "ring", "plus", "vertical_bars", "horizontal_bars",
    // Advanced
    "flower_cut", "clover", "rounded_plus", "sheared", "bevel", "fishtail", "squircle", 
    "target_bullseye", "diamond_target", "dotted_cross", "arrow", "gear_dot", "hourglass", 
    "pinwheel", "leaf_droplet", "pillow", "quad_dots", "tech_chevron", "sparkle", 
    "medical_cross", "lotus_petal", "network_nodes"
  ]

  const eyeFrameStyles = [
    // Normal
    "square", "rounded", "circle", "diamond", "hexagon", "octagon",
    // Intermediate
    "star", "leaf", "shield", "gear", "droplet_tl", "droplet_tr", "droplet_bl",
    // Advanced
    "corner_brackets", "double_ring", "dotted_circle", "leaf_opposite", "shield_opposite", 
    "left_rounded", "right_rounded", "solid_square_circle_cut", "sheared", "crystal_frame", 
    "arch_frame", "cross_notch_frame", "pill_frame", "pointed_top_frame", "aztec_step_frame", 
    "tv_frame", "house_frame", "camera_lens", "steering_wheel"
  ]

  const eyeballStyles = [
    // Normal
    "square", "rounded", "circle", "diamond", "hexagon", "octagon",
    // Intermediate
    "star", "leaf", "shield", "gear", "flower", "cross", "plus", "rhombus",
    // Advanced
    "corner_brackets", "target_bullseye", "leaf_opposite", "shield_opposite", 
    "left_rounded", "right_rounded", "droplet_tl", "droplet_tr", "droplet_bl", 
    "sheared", "flower_cut", "clover", "heart", "rounded_triangle", "pinched_square", 
    "dumbbell_eyeball"
  ]
  const frameStyles = ["none", "border", "double_border", "circle", "phone_frame", "chalkboard"]
  const textStyles = ["none", "top_text", "bottom_text", "speech_bubble", "floating_badge"]
  
  return (
    <div className="space-y-8 pb-10">
      
      {/* Content Type Selector */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
          Select Content Type
        </h3>
        <div className="space-y-6">
          {contentCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">{category.title}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {category.items.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateSettings({ contentType: type.id as any })}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      settings.contentType === type.id 
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary shadow-sm' 
                        : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm'
                    }`}
                  >
                    <type.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Input */}
      <section className="space-y-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold">Enter Content</h3>
        {settings.contentType === "url" && <UrlForm />}
        {settings.contentType === "text" && <TextForm />}
        {settings.contentType === "phone" && <PhoneForm />}
        {settings.contentType === "sms" && <SmsForm />}
        {settings.contentType === "whatsapp" && <WhatsAppForm />}
        {settings.contentType === "email" && <EmailForm />}
        {settings.contentType === "vcard" && <VCardForm />}
        {settings.contentType === "wifi" && <WifiForm />}
        {settings.contentType === "location" && <LocationForm />}
        {settings.contentType === "event" && <EventForm />}
        {settings.contentType === "upi" && <UpiForm />}
        {settings.contentType === "crypto" && <CryptoForm />}
        {settings.contentType === "paypal" && <PaypalForm />}
        {settings.contentType === "appstore" && <AppStoreForm />}
        {settings.contentType === "googleplay" && <GooglePlayForm />}
        {settings.contentType === "social" && <SocialForm />}
      </section>

      {/* Design Customization */}
      <section className="space-y-6 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
          Design & Colors
        </h3>
        
        <div className={`grid grid-cols-1 ${settings.gradient_type && settings.gradient_type !== "Solid Color" ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {settings.gradient_type && settings.gradient_type !== "Solid Color" ? "Foreground (Start)" : "Foreground Color"}
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={settings.dots_color} 
                onChange={(e) => updateSettings({ dots_color: e.target.value })}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
              <input 
                type="text" 
                value={settings.dots_color} 
                onChange={(e) => updateSettings({ dots_color: e.target.value })}
                className="flex-1 p-2 border border-input rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {settings.gradient_type && settings.gradient_type !== "Solid Color" && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Foreground (End)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings.dots_color_end || "#52525b"} 
                  onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={settings.dots_color_end || "#52525b"} 
                  onChange={(e) => updateSettings({ dots_color_end: e.target.value })}
                  className="flex-1 p-2 border border-input rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Background Color</label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.bg_transparent || false}
                  onChange={(e) => updateSettings({ bg_transparent: e.target.checked, ...(e.target.checked ? { effect_shadow: "none" } : {}) })}
                  className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                />
                <span>Transparent</span>
              </label>
            </div>
            <div className={`flex items-center gap-3 ${settings.bg_transparent ? 'opacity-40 pointer-events-none' : ''}`}>
              <input 
                type="color" 
                value={settings.bg_color} 
                onChange={(e) => updateSettings({ bg_color: e.target.value })}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
              <input 
                type="text" 
                value={settings.bg_color} 
                onChange={(e) => updateSettings({ bg_color: e.target.value })}
                className="flex-1 p-2 border border-input rounded-lg"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Background Image</label>
              {settings.bg_image && (
                <button 
                  onClick={() => updateSettings({ bg_image: undefined })}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    updateSettings({ bg_image: ev.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {settings.bg_image && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <label className="text-xs text-muted-foreground">Opacity</label>
                  <span className="text-xs font-mono">{settings.bg_image_opacity || 1}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.bg_image_opacity || 1}
                  onChange={(e) => updateSettings({ bg_image_opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          <label className="text-sm font-medium sticky top-0 bg-card z-10 py-1 block">Dot Style</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {dotStyles.map(style => (
              <button 
                key={style}
                onClick={() => updateSettings({ dots_style: style as any })}
                className={`p-2 border rounded-lg text-[10px] sm:text-xs capitalize transition-colors truncate ${settings.dots_style === style ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                title={style.replace(/_/g, ' ')}
              >
                {style.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          <label className="text-sm font-medium sticky top-0 bg-card z-10 py-1 block">Eye Frame Style</label>
          <div className="grid grid-cols-3 gap-2">
            {eyeFrameStyles.map(style => (
              <button 
                key={style}
                onClick={() => updateSettings({ eye_frame_style: style as any })}
                className={`p-2 border rounded-lg text-[10px] sm:text-xs capitalize transition-colors truncate ${settings.eye_frame_style === style ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                title={style.replace(/_/g, ' ')}
              >
                {style.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          <label className="text-sm font-medium sticky top-0 bg-card z-10 py-1 block">Eyeball Style</label>
          <div className="grid grid-cols-3 gap-2">
            {eyeballStyles.map(style => (
              <button 
                key={style}
                onClick={() => updateSettings({ eyeball_style: style as any })}
                className={`p-2 border rounded-lg text-[10px] sm:text-xs capitalize transition-colors truncate ${settings.eyeball_style === style ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                title={style.replace(/_/g, ' ')}
              >
                {style.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Frame Settings */}
      <section className="space-y-6 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
          Frame & Text
        </h3>

        <div className="space-y-3">
          <label className="text-sm font-medium">Frame Style</label>
          <div className="grid grid-cols-3 gap-2">
            {frameStyles.map(style => (
              <button 
                key={style}
                onClick={() => updateSettings({ frame_style: style as any })}
                className={`p-2 border rounded-lg text-xs capitalize transition-colors ${settings.frame_style === style ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
              >
                {style.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Text Template</label>
          <div className="grid grid-cols-3 gap-2">
            {textStyles.map(style => (
              <button 
                key={style}
                onClick={() => updateSettings({ text_style: style as any })}
                className={`p-2 border rounded-lg text-xs capitalize transition-colors ${settings.text_style === style ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
              >
                {style.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {settings.text_style !== "none" && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Frame Text</label>
            <input 
              type="text" 
              value={settings.frame_text}
              onChange={(e) => updateSettings({ frame_text: e.target.value })}
              className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}
      </section>
    </div>
  )
}
