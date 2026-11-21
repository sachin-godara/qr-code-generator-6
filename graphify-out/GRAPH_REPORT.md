# Graph Report - .  (2026-11-21)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1165 nodes · 2000 edges · 123 communities (81 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `783d1c67`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 107
- Community 108

## God Nodes (most connected - your core abstractions)
1. `useQRStore` - 45 edges
2. `useTranslation()` - 44 edges
3. `getLocalizedUrl()` - 30 edges
4. `QRCodeEnhanced` - 28 edges
5. `Locale` - 27 edges
6. `t()` - 26 edges
7. `EnhancedQRCodeMCPServer` - 20 edges
8. `compilerOptions` - 19 edges
9. `deep_scan_qr()` - 17 edges
10. `generate_qr_image()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `test_logo_utilities()` --calls--> `make_color_transparent()`  [INFERRED]
  backend/tests/test_engines.py → backend/engines/logo/processor.py
- `draw_eyeball()` --calls--> `generate_deckled_rect()`  [INFERRED]
  backend/engines/eyes/eyeballs.py → backend/engines/core/noise.py
- `draw_eye_frame()` --calls--> `draw_crystal_frame_func()`  [INFERRED]
  backend/engines/eyes/eye_frames.py → backend/engines/core/noise.py
- `apply_layout_frame()` --calls--> `hex_to_rgb()`  [INFERRED]
  backend/engines/frames/text_frames.py → backend/engines/core/utils.py
- `apply_text_frame()` --calls--> `hex_to_rgb()`  [INFERRED]
  backend/engines/frames/text_frames.py → backend/engines/core/utils.py

## Import Cycles
- None detected.

## Communities (123 total, 42 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): qrcode, EnhancedQRCodeMCPServer, server, createCanvas(), loadImage(), QRCodeEnhanced, BatchQR, BatchQRSchema (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (33): BatchItem, BatchQRRequest, generate_batch(), generate_pdf(), generate_qr(), generate_svg(), get_frame_thumbnail(), get_text_frame_thumbnail() (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (41): astro, @astrojs/react, @astrojs/rss, @astrojs/sitemap, class-variance-authority, clsx, @emnapi/core, @emnapi/runtime (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (29): getReactLogoPngDataUrl(), LOGO_CATEGORIES, LOGO_ITEMS, logoDataUrlCache, LogoMetadata, PRESET_LOGO_BRAND_COLORS, PresetLogoPreview(), PresetLogoPreviewProps (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (33): devDependencies, jsdom, @testing-library/dom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/react, @types/react-dom (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (13): ../i18n/config, ../i18n/utils, ../styles/blog.css, ../styles/global.css, blogUrl, homeUrl, howToUrl, isBlog (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (14): get_client_ip(), Request, Safely resolves client IP for rate limiting behind reverse proxies     (Cloudfla, health_check(), LimitRequestBodyMiddleware, Request, SecurityHeadersMiddleware, ContactForm (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (24): attempt_decode(), deep_scan_qr(), get_aruco_detector(), get_standard_detector(), get_wechat_detector(), pad_quiet_zone(), ndarray, Applies a comprehensive waterfall of computer vision techniques to stubbornly sc (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (22): AppStoreForm(), CryptoForm(), EmailForm(), EventForm(), GooglePlayForm(), LocationForm(), PaypalForm(), PhoneForm() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, allowSyntheticDefaultImports, declaration, declarationMap, emitDecoratorMetadata, esModuleInterop, experimentalDecorators (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (27): eslint, jest, devDependencies, eslint, jest, ts-jest, tsx, @types/fs-extra (+19 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (25): chalk, commander, fs-extra, jimp, jsqr, dependencies, chalk, commander (+17 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): OUTPUT_DIR, PRESET_TEMPLATES, Template, GRADIENT_PRESETS, QRState, ContentType, defaultSettings, QRSettings (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (4): ../react/QRGeneratorApp, TranslationProvider(), QRGeneratorAppProps, queryClient

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (19): allowedIdentical, blogFiles, blogParagraphIssues, __dirname, distIssues, distTr, englishCommonParagraphWords, enLoc (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (15): DISCRETE_KEYS, useDebounce(), useSmartQRSettingsDebounce(), KeyboardShortcutHandlers, useKeyboardShortcuts(), useMiniPreview(), useOnlineStatus(), App() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (20): aboutUrl, blogUrl, cardGuideUrl, colorGuideUrl, contactUrl, currentYear, emailQrUrl, eventQrUrl (+12 more)

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (5): BevelModuleDrawer, LeafConnectModuleDrawer, ScallopedModuleDrawer, ShieldConnectModuleDrawer, SteppedModuleDrawer

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (7): ../../i18n/blogUtils, getSmartRelatedPosts(), relatedPosts, relatedPosts, relatedPosts, relatedPosts, relatedPosts

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (14): cleanPath, currentLocale, isValidLocale(), getLocalizedSlug(), getRouteIdFromPath(), LocalizedRouteId, localizedSlugMap, slugToRouteId (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (8): Locale, localeConfig, LocaleInfo, locales, TranslationContext, TranslationContextType, TranslationProviderProps, dictionaries

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (17): author, bin, mcp-qrcode-enhanced, bugs, url, description, engines, node (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.12
Nodes (14): blogBaseDir, blogDirs, componentsDir, errors, headersFile, locales, localesDir, pagesDir (+6 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (14): generate_svg_qr(), Sanitizes color strings to prevent XML/SVG injection (XSS)., Generates a raw SVG QR code (without custom styled dots or frames), sanitize_svg_color(), Verify standard defensive security headers are returned on all API responses., Verify path traversal strings in font resolution fallback securely to standard f, Verify malicious color strings cannot inject XML/script tags into SVG., Verify scan endpoint rejects non-image files. (+6 more)

### Community 24 - "Community 24"
Cohesion: 0.21
Nodes (11): StylePreviewCard(), StylePreviewCardProps, loadFrameFonts(), PremiumFontSelect(), PremiumFontSelectProps, DOT_STYLES, EYE_FRAME_STYLES, EYEBALL_STYLES (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.32
Nodes (9): useDownloadHandlers(), DownloadPanel(), DownloadPanelProps, DesktopPreviewPane(), DesktopPreviewPaneProps, MobileBottomBar(), MobileBottomBarProps, DownloadState (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (13): background_color, categories, description, display, icons, name, orientation, short_name (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (5): CrossstitchModuleDrawer, HourglassModuleDrawer, MoonCrescentModuleDrawer, PinwheelModuleDrawer, StyledPilQRModuleDrawer

### Community 28 - "Community 28"
Cohesion: 0.26
Nodes (10): hex_to_rgb(), Converts a hex color string (e.g. '#FF0000' or 'FF0000') to an RGB tuple (255, 0, apply_logo_overlay(), generate_preset_logo(), make_color_transparent(), Image, Make a specific color (or close to it) transparent in a PIL Image., remove_qr_background() (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (4): FishtailModuleDrawer, HeartModuleDrawer, MedicalCrossModuleDrawer, PixelArtModuleDrawer

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, paths, exclude, extends, include, dist (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (12): jest, collectCoverageFrom, preset, roots, testEnvironment, testMatch, <rootDir>/src, <rootDir>/tests (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (9): draw_crystal_frame_func(), fractal_noise_1d(), generate_deckled_rect(), value_noise_1d(), draw_eye_frame(), find_coeffs(), make_sharp_corner(), Renders outer eye frame onto draw canvas at (px, py) position with module size s (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (3): BlockBridgeModuleDrawer, PillowModuleDrawer, SleekDashModuleDrawer

### Community 34 - "Community 34"
Cohesion: 0.20
Nodes (4): ../i18n/blogTranslations, blogTranslations, getLocalizedPostData(), LocalizedBlogMeta

### Community 35 - "Community 35"
Cohesion: 0.20
Nodes (6): CustomStyledPilImage, DiagonalGradiantColorMask, Fills in the foreground with a gradient sweeping diagonally from corner to corne, Subclass of StyledPilImage that fixes the python qrcode library bug on dark back, QRColorMask, StyledPilImage

### Community 36 - "Community 36"
Cohesion: 0.20
Nodes (10): scripts, build, clean, dev, lint, lint:fix, prepublishOnly, start (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (6): draw_eyeball(), make_eyeball_sharp_corner(), Renders inner eyeball onto draw canvas at ebx=px+2*s, eby=py+2*s with module siz, test_eye_frames_and_eyeballs_rendering(), test_layout_frames(), test_logo_utilities()

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (7): blogDir, blogDiscrepancies, enFiles, enSeo, locales, seoDir, seoDiscrepancies

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (9): @modelcontextprotocol/sdk, keywords, @modelcontextprotocol/sdk, analysis, enhanced, generation, mcp, qr-code (+1 more)

### Community 41 - "Community 41"
Cohesion: 0.25
Nodes (6): DIST_DIR, existingRoutes, htmlFiles, longestPages, report, shortestPages

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (5): allKeywords, distDir, htmlFiles, output, pages

### Community 43 - "Community 43"
Cohesion: 0.43
Nodes (4): ScannabilityAlert(), Slider(), SliderProps, logoCardShapes

### Community 44 - "Community 44"
Cohesion: 0.25
Nodes (7): blog, blog_de, blog_es, blog_pt, blog_tr, blogSchema, collections

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (5): distFiles, httpLinks, malformedLinks, nonTrailingSlashLinks, wwwLinks

### Community 46 - "Community 46"
Cohesion: 0.29
Nodes (4): allKeys, dicts, locales, reactDir

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (5): distRedirects, forbiddenDirs, normalizedDistLines, requiredPages, requiredRedirectRules

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (4): auditResults, distDir, htmlFiles, locales

### Community 52 - "Community 52"
Cohesion: 0.53
Nodes (4): useToast(), ToastItem, ToastState, useToastStore

### Community 59 - "Community 59"
Cohesion: 0.70
Nodes (4): apply_frame(), apply_layout_frame(), apply_text_frame(), resolve_font_path()

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (4): colorPairs, files, getContrast(), getLuminance()

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (4): content, missing, normalizedLines, requiredRules

### Community 62 - "Community 62"
Cohesion: 0.40
Nodes (3): DIST_DIR, htmlFiles, violations

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (3): articlesWithoutToolLinks, blogFiles, report

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (3): hrefMatches, html, uniqueHrefs

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (3): blogDir, enFiles, translations

### Community 67 - "Community 67"
Cohesion: 0.50
Nodes (3): privacyPage, scannerPage, termsPage

### Community 68 - "Community 68"
Cohesion: 0.50
Nodes (4): files, dist/**/*, LICENSE, README.md

## Knowledge Gaps
- **330 isolated node(s):** `OUTPUT_DIR`, `name`, `type`, `version`, `node` (+325 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qrcode` connect `Community 0` to `Community 7`, `Community 39`, `Community 23`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 2` to `Community 4`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `QRScannerAppContent()` connect `Community 3` to `Community 8`, `Community 2`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `OUTPUT_DIR`, `name`, `type` to the rest of the system?**
  _330 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.059720869847452125 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0730804810360777 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._