import json
import networkx as nx
from pathlib import Path

graph_data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))

G = nx.Graph()
for n in graph_data['nodes']:
    G.add_node(n['id'], label=n.get('label', n['id']), group=n.get('group'))

for e in graph_data['links']:
    G.add_edge(e['source'], e['target'], relation=e.get('relation', 'connected'))

targets = ['package_name', 'package_type', 'package_version']
found_nodes = []
for n in G.nodes:
    # Check if the node label or id is name/type/version
    lbl = G.nodes[n].get('label', '')
    if lbl in ['name', 'type', 'version'] or n in targets:
        found_nodes.append(n)

print(f"Found target nodes: {found_nodes}")

# Let's find neighbors and paths to the giant component
for fn in found_nodes:
    neighbors = list(G.neighbors(fn))
    print(f"\nNeighbors of {fn} ({G.nodes[fn].get('label')}):")
    for nb in neighbors:
        edge_data = G.get_edge_data(fn, nb)
        print(f"  - {nb} ({G.nodes[nb].get('label')}) via {edge_data.get('relation')}")

    # Check if connected to main components like 'package'
    for core in ['package', 'package_scripts']:
        if core in G:
            try:
                path = nx.shortest_path(G, fn, core)
                print(f"  Path from {fn} to {core}: {' -> '.join(path)}")
            except nx.NetworkXNoPath:
                print(f"  No path to {core}")
