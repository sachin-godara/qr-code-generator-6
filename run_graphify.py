import json, sys, os
from pathlib import Path
from datetime import datetime, timezone

Path('graphify-out').mkdir(exist_ok=True)

print("Starting detection...")
from graphify.detect import detect
# Prune node_modules early if possible, detect should handle it.
detection = detect(Path('.'))
Path('graphify-out/.graphify_detect.json').write_text(json.dumps(detection, ensure_ascii=False), encoding="utf-8")
print(f"Corpus: {detection.get('total_files', 0)} files")

print("Starting extraction...")
from graphify.extract import collect_files, extract
code_files = []
for f in detection.get('files', {}).get('code', []):
    p = Path(f)
    if 'node_modules' in p.parts or 'venv' in p.parts or '.venv' in p.parts:
        continue
    code_files.extend(collect_files(p) if p.is_dir() else [p])

if code_files:
    ast = extract(code_files, cache_root=Path('.'))
else:
    ast = {'nodes':[], 'edges':[], 'input_tokens':0, 'output_tokens':0}

Path('graphify-out/.graphify_extract.json').write_text(json.dumps(ast, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"AST: {len(ast['nodes'])} nodes, {len(ast['edges'])} edges")

print("Building graph...")
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

G = build_from_json(ast, root='.')
if G.number_of_nodes() == 0:
    print('ERROR: Graph is empty')
    sys.exit(1)

communities = cluster(G)
cohesion = score_all(G, communities)
gods = god_nodes(G)
surprises = surprising_connections(G, communities)
labels = {cid: f'Community {cid}' for cid in communities}
questions = suggest_questions(G, communities, labels)

to_json(G, communities, 'graphify-out/graph.json')
tokens = {'input': ast.get('input_tokens', 0), 'output': ast.get('output_tokens', 0)}
report = generate(G, communities, cohesion, labels, gods, surprises, detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
print(f"Graph: {G.number_of_nodes()} nodes, {len(communities)} communities")

import subprocess
subprocess.run([sys.executable, "-m", "graphify", "export", "html"])
print("HTML generated")
