# 📄 02 - Intermediate Data Schemas & Cache Manifest

> **Comprehensive data dictionary and schema reference for all intermediate JSON artifacts and caching manifests in `graphify-out/`.**

---

## 🗄️ 1. Intermediate Artifact Schemas

```
graphify-out/
├── .graphify_detect.json       # Stage 1 Detection output
├── .graphify_ast.json          # Stage 2 Raw AST extraction
├── .graphify_semantic.json     # Stage 3 Semantic relations
├── .graphify_extract.json      # Stage 3 Unified extraction
├── .graphify_analysis.json     # Stage 4 Community analysis
├── graph.json                  # Stage 4 Serialized NetworkX graph
├── manifest.json               # Incremental file change tracking
└── cost.json                   # Token & execution accounting
```

---

## 📋 2. Schema Breakdown

### 1. `.graphify_detect.json` (Corpus Detection)
```json
{
  "scan_root": "F:\\Project 001\\qr code generator 6\\backend",
  "total_files": 45,
  "total_words": 49956,
  "files": {
    "code": [
      "F:\\Project 001\\qr code generator 6\\backend\\main.py",
      "F:\\Project 001\\qr code generator 6\\backend\\qr_engine.py",
      "F:\\Project 001\\qr code generator 6\\backend\\services\\qr_service.py"
    ],
    "document": [],
    "image": []
  },
  "skipped_sensitive": []
}
```

---

### 2. `.graphify_extract.json` (Unified AST & Edge Extraction)
```json
{
  "nodes": [
    {
      "id": "engines_core_utils_hex_to_rgb",
      "label": "hex_to_rgb()",
      "source_file": "backend/engines/core/utils.py",
      "source_location": "8-18",
      "type": "function"
    },
    {
      "id": "services_qr_service_generate_qr_image",
      "label": "generate_qr_image()",
      "source_file": "backend/services/qr_service.py",
      "source_location": "112-180",
      "type": "function"
    }
  ],
  "edges": [
    {
      "source": "services_qr_service_generate_qr_image",
      "target": "engines_core_utils_hex_to_rgb",
      "relation": "calls",
      "confidence": 1.0
    }
  ],
  "hyperedges": [],
  "input_tokens": 0,
  "output_tokens": 0
}
```

---

### 3. `graph.json` (NetworkX Serialized Graph)
Conforms to NetworkX `node_link_data` specification:
```json
{
  "directed": false,
  "multigraph": false,
  "graph": {},
  "nodes": [
    {
      "id": "services_qr_service_generate_qr_image",
      "label": "generate_qr_image()",
      "community": 1,
      "source_file": "backend/services/qr_service.py"
    }
  ],
  "links": [
    {
      "source": "services_qr_service_generate_qr_image",
      "target": "engines_core_utils_hex_to_rgb",
      "relation": "calls",
      "confidence": 1.0
    }
  ]
}
```

---

### 4. `.graphify_analysis.json` (Topological Intelligence)
```json
{
  "communities": {
    "0": ["engines_core_noise", "engines_eyes_eye_frames", "..."],
    "1": ["routers_generator", "services_qr_service", "..."]
  },
  "cohesion": {
    "0": 0.09,
    "1": 0.08,
    "3": 0.12
  },
  "gods": [
    {"name": "generate_qr_image()", "edges": 17},
    {"name": "hex_to_rgb()", "edges": 14},
    {"name": "draw_eye_frame()", "edges": 11}
  ],
  "surprises": [
    {
      "source": "apply_canvas_effects()",
      "target": "hex_to_rgb()",
      "relation": "calls",
      "type": "INFERRED"
    }
  ]
}
```

---

## ⚡ 3. Incremental Cache Manifest (`manifest.json`)

To prevent re-parsing unchanged files during successive Graphify builds, `manifest.json` tracks file modification timestamps (`mtime`) and cryptographic hashes:

```json
{
  "src/components/previews/SvgIcons.tsx": {
    "mtime": 1786551090.8893554,
    "ast_hash": "fac0a384a1a9db20b88a86460e4e0543",
    "semantic_hash": "fac0a384a1a9db20b88a86460e4e0543"
  },
  "src/data/templates.ts": {
    "mtime": 1786556001.926186,
    "ast_hash": "9f575997e41d5487ab852f30fd79b78f",
    "semantic_hash": "9f575997e41d5487ab852f30fd79b78f"
  }
}
```
If a file's `mtime` has not changed, its AST sub-tree is loaded instantly from the `.graphify_ast.json` cache, accelerating incremental graph builds to **`< 200 ms`**.
