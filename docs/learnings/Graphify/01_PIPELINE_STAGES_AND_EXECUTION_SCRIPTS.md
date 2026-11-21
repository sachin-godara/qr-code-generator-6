# 📜 01 - Pipeline Stages & Execution Scripts Breakdown

> **Detailed code and operational breakdown of all 8 automation scripts in `graphify-out/` orchestrating AST extraction, graph merging, community detection, and query execution.**

---

## 🛠️ 1. Master Graph Builder (`build.py`)

`graphify-out/build.py` is the central orchestration script that constructs the NetworkX graph and runs topological analytics:

```python
extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8'))
detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8-sig'))
scan_root = detect.get('scan_root')

# 1. Construct NetworkX Graph Structure
G = build_from_json(extraction, root=scan_root, directed=False)

if G.number_of_nodes() == 0:
    print('ERROR: Graph is empty - extraction produced no nodes.')
    raise SystemExit(1)

# 2. Graph Community Clustering & Cohesion Scoring
communities = cluster(G)
cohesion = score_all(G, communities)

# 3. Topological Analytics
gods = god_nodes(G)
surprises = surprising_connections(G, communities)
labels = {cid: f'Community {cid}' for cid in communities}
questions = suggest_questions(G, communities, labels)

# 4. Serialize Outputs
to_json(G, communities, 'graphify-out/graph.json', force=True)
report = generate(G, communities, cohesion, labels, gods, surprises, detect, tokens, scan_root, suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
```

---

## 🔍 2. Static AST Symbol Extractor (`ast_extract.py`)

Parses source code files to build the structural AST graph:

```python
code_files = []
detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
scan_root = Path(detect['scan_root'])

for f in detect.get('files', {}).get('code', []):
    fp = Path(f)
    if fp.is_dir():
        code_files.extend(collect_files(fp))
    else:
        code_files.append(fp)

if code_files:
    result = extract(code_files, cache_root=scan_root)
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
```

---

## 🔀 3. Graph Node & Edge Merger (`merge.py`)

Unifies AST structural nodes and semantic relationship hyperedges into `.graphify_extract.json` while eliminating duplicate IDs:

```python
ast = json.loads(Path('graphify-out/.graphify_ast.json').read_text(encoding='utf-8'))
sem = json.loads(Path('graphify-out/.graphify_semantic.json').read_text(encoding='utf-8'))

seen = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])
for n in sem['nodes']:
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

merged_edges = ast['edges'] + sem['edges']
merged_hyperedges = sem.get('hyperedges', [])
merged = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'input_tokens': sem.get('input_tokens', 0),
    'output_tokens': sem.get('output_tokens', 0),
}
Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding='utf-8')
```

---

## 🔎 4. Token-Budgeted Subgraph Query Engine (`query.py`)

Allows AI agents to query the graph using natural language search terms, expanding a multi-hop frontier (BFS or DFS) bounded by a strict token budget:

```python
data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))
G = json_graph.node_link_graph(data, edges='links')

# 1. Term Matching & Scoring
terms = [t.lower() for t in question.split() if len(t) >= 3]
scored = [(sum(1 for t in terms if t in ndata.get('label', '').lower()), nid) for nid, ndata in G.nodes(data=True)]
scored.sort(reverse=True)
start_nodes = [nid for _, nid in scored[:3]]

# 2. Multi-Hop BFS Frontier Expansion (Depth 3)
subgraph_nodes = set(start_nodes)
frontier = set(start_nodes)
for _ in range(3):
    next_frontier = set()
    for n in frontier:
        for neighbor in G.neighbors(n):
            if neighbor not in subgraph_nodes:
                next_frontier.add(neighbor)
    subgraph_nodes.update(next_frontier)
    frontier = next_frontier

# 3. Token-Budget Formatting
token_budget = 2000
char_budget = token_budget * 4
...
```

---

## 📖 5. Domain Vocabulary Identifier Tokenizer (`vocab.py`)

Extracts domain terminology from symbol names using camelCase and snake_case regex parsing, creating `.vocab.txt`:

```python
data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))
vocab = set()
for n in data['nodes']:
    for c in re.findall(r'[^\W\d_]+', n.get('label','') or '', re.UNICODE):
        parts = re.findall(r'[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+', c) or [c]
        for p in parts:
            t = p.lower()
            if 3 <= len(t) <= 30:
                vocab.add(t)
Path('graphify-out/.vocab.txt').write_text('\n'.join(sorted(vocab)), encoding='utf-8')
```
