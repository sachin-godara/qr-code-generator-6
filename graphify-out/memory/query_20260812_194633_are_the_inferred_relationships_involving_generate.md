---
type: "query"
date: "2026-08-12T19:46:33.774064+00:00"
question: "Are the inferred relationships involving generate_qr_image() actually correct?"
contributor: "graphify"
outcome: "corrected"
correction: "generate_qr() calls generate_qr_image(), not the other way around."
source_nodes: ["generate_qr_image()", "hex_to_rgb()", "generate_qr()"]
---

# Q: Are the inferred relationships involving generate_qr_image() actually correct?

## Answer

Expanded from original query via vocab: ['generate', 'image']. Then traversed BFS. Found that generate_qr_image() --calls--> hex_to_rgb() is correct, as line 280 in services/qr_service.py calls it. However, generate_qr_image() --indirect_call--> generate_qr() is incorrect (reversed); the router (generate_qr) actually calls the service (generate_qr_image).

## Outcome

- Signal: corrected
- Correction: generate_qr() calls generate_qr_image(), not the other way around.

## Source Nodes

- generate_qr_image()
- hex_to_rgb()
- generate_qr()