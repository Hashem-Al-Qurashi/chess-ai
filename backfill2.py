#!/usr/bin/env python3
"""Backfill GitHub contributions for gap days (April 2024 - March 2025)."""

import json
import os
import random
import subprocess

# Load gap dates
g1 = json.load(open('/tmp/gaps1.json'))
g2 = json.load(open('/tmp/gaps2.json'))
all_gaps = sorted(set(g1 + g2))
GAP_DATES = [d for d in all_gaps if d <= '2025-03-02']

# Chess endgame positions (FEN)
ENDGAMES = [
    {"name": "King and Queen vs King", "fen": "4k3/8/8/8/8/8/8/4K2Q w - - 0 1"},
    {"name": "King and Rook vs King", "fen": "4k3/8/8/8/8/8/8/4K2R w - - 0 1"},
    {"name": "King and 2 Bishops vs King", "fen": "4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1"},
    {"name": "King and Pawn vs King", "fen": "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1"},
    {"name": "Lucena Position", "fen": "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1"},
    {"name": "Philidor Position", "fen": "4k3/8/4K3/4P3/8/8/8/r7 b - - 0 1"},
    {"name": "Queen vs Rook", "fen": "4k3/8/8/8/8/8/8/Q3K2r w - - 0 1"},
    {"name": "Rook and Pawn vs Rook", "fen": "4k3/8/4K3/4P3/8/8/r7/4R3 w - - 0 1"},
    {"name": "Two Rooks vs King", "fen": "4k3/8/8/8/8/8/8/R3K2R w - - 0 1"},
    {"name": "Bishop and Knight Mate", "fen": "4k3/8/8/8/8/8/8/1B2K1N1 w - - 0 1"},
    {"name": "King Opposition", "fen": "4k3/8/4K3/4P3/8/8/8/8 w - - 0 1"},
    {"name": "Triangulation", "fen": "8/8/4k3/8/4K3/4P3/8/8 w - - 0 1"},
    {"name": "Stalemate Trap", "fen": "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1"},
    {"name": "Fortress Draw", "fen": "8/8/8/1k6/8/1K6/1B6/8 w - - 0 1"},
    {"name": "Wrong Bishop Pawn", "fen": "8/8/8/7k/8/8/7P/5K1B w - - 0 1"},
]

# Chess principles and tips
PRINCIPLES = [
    {"category": "Opening", "tip": "Control the center with pawns e4/d4"},
    {"category": "Opening", "tip": "Develop knights before bishops"},
    {"category": "Opening", "tip": "Castle early for king safety"},
    {"category": "Opening", "tip": "Don't move the same piece twice in the opening"},
    {"category": "Opening", "tip": "Don't bring the queen out too early"},
    {"category": "Opening", "tip": "Connect your rooks"},
    {"category": "Opening", "tip": "Fight for the center even with flank openings"},
    {"category": "Middlegame", "tip": "Create and exploit weak squares"},
    {"category": "Middlegame", "tip": "Place rooks on open files"},
    {"category": "Middlegame", "tip": "Knights are better in closed positions"},
    {"category": "Middlegame", "tip": "Bishops are better in open positions"},
    {"category": "Middlegame", "tip": "Avoid pawn islands"},
    {"category": "Middlegame", "tip": "Double rooks on open files"},
    {"category": "Middlegame", "tip": "Trade pieces when ahead in material"},
    {"category": "Middlegame", "tip": "Create passed pawns"},
    {"category": "Middlegame", "tip": "Restrict the opponent's pieces"},
    {"category": "Middlegame", "tip": "Look for tactical motifs: pins, forks, skewers"},
    {"category": "Middlegame", "tip": "Control key diagonals with bishops"},
    {"category": "Endgame", "tip": "King becomes an active piece in the endgame"},
    {"category": "Endgame", "tip": "Push passed pawns in the endgame"},
    {"category": "Endgame", "tip": "Rook belongs behind passed pawns"},
    {"category": "Endgame", "tip": "Opposition is key in king and pawn endings"},
    {"category": "Endgame", "tip": "Centralize the king in the endgame"},
    {"category": "Endgame", "tip": "Cut off the enemy king with rooks"},
    {"category": "Endgame", "tip": "Two connected passed pawns beat a rook"},
    {"category": "Endgame", "tip": "Triangulation to gain tempo"},
    {"category": "Strategy", "tip": "Create a plan and follow it"},
    {"category": "Strategy", "tip": "Prophylaxis: prevent opponent's ideas"},
    {"category": "Strategy", "tip": "Improve your worst-placed piece"},
    {"category": "Strategy", "tip": "Pawn structure determines piece placement"},
    {"category": "Strategy", "tip": "Space advantage allows more maneuvering"},
    {"category": "Strategy", "tip": "Minority attack against pawn chains"},
    {"category": "Strategy", "tip": "Blockade passed pawns with knights"},
    {"category": "Strategy", "tip": "Exchange your bad bishop"},
    {"category": "Strategy", "tip": "Create weaknesses on both flanks"},
]

# Famous chess games
FAMOUS_GAMES = [
    {"year": 1851, "white": "Anderssen", "black": "Kieseritzky", "name": "The Immortal Game"},
    {"year": 1852, "white": "Anderssen", "black": "Dufresne", "name": "The Evergreen Game"},
    {"year": 1858, "white": "Morphy", "black": "Duke of Brunswick", "name": "The Opera Game"},
    {"year": 1895, "white": "Steinitz", "black": "Von Bardeleben", "name": "Steinitz Immortal"},
    {"year": 1912, "white": "Levitsky", "black": "Marshall", "name": "The Gold Coins Game"},
    {"year": 1918, "white": "Rotlewi", "black": "Rubinstein", "name": "Rubinstein's Immortal"},
    {"year": 1925, "white": "Torre", "black": "Lasker", "name": "Torre's Immortal"},
    {"year": 1935, "white": "Alekhine", "black": "Bogoljubow", "name": "Alekhine's Brilliance"},
    {"year": 1956, "white": "Byrne", "black": "Fischer", "name": "The Game of the Century"},
    {"year": 1960, "white": "Fischer", "black": "Spassky", "name": "Fischer's Masterpiece"},
    {"year": 1970, "white": "Spassky", "black": "Fischer", "name": "Game 6, World Championship"},
    {"year": 1972, "white": "Fischer", "black": "Petrosian", "name": "Fischer's Sicilian"},
    {"year": 1985, "white": "Kasparov", "black": "Karpov", "name": "Kasparov's 24th"},
    {"year": 1991, "white": "Kasparov", "black": "Anand", "name": "Kasparov's Scotch"},
    {"year": 1999, "white": "Kasparov", "black": "Topalov", "name": "Kasparov's Immortal"},
    {"year": 2013, "white": "Carlsen", "black": "Anand", "name": "Carlsen's WC Win"},
    {"year": 2016, "white": "Caruana", "black": "Carlsen", "name": "Caruana's Brilliance"},
    {"year": 2018, "white": "Carlsen", "black": "Caruana", "name": "WC Tiebreak"},
]

# Data files to write to
FILES = {
    'endgames': 'src/data/endgames.ts',
    'principles': 'src/data/principles.ts',
    'famous': 'src/data/famous-games.ts',
}

TEMPLATES = [
    "Add {item_type}: {name}",
    "Expand {item_type} database with {name}",
    "Include {name} in {item_type} collection",
    "Add new {item_type} entry: {name}",
    "Extend {item_type} data: {name}",
    "Register {name} in {item_type}",
    "Catalog {name} as {item_type}",
    "Document {item_type}: {name}",
    "Add {name} to {item_type} reference",
    "Update {item_type} with {name}",
    "Insert {item_type} entry for {name}",
    "Append {name} to {item_type} list",
    "Record {name} in {item_type} data",
    "Log {item_type}: {name}",
    "Store {name} as {item_type} data",
]


def init_files():
    """Create the data files if they don't exist."""
    os.makedirs('src/data', exist_ok=True)

    if not os.path.exists(FILES['endgames']):
        with open(FILES['endgames'], 'w') as f:
            f.write('export interface Endgame {\n  name: string\n  fen: string\n}\n\n')
            f.write('export const endgamePositions: Endgame[] = [\n]\n')

    if not os.path.exists(FILES['principles']):
        with open(FILES['principles'], 'w') as f:
            f.write('export interface ChessPrinciple {\n  category: string\n  tip: string\n}\n\n')
            f.write('export const chessPrinciples: ChessPrinciple[] = [\n]\n')

    if not os.path.exists(FILES['famous']):
        with open(FILES['famous'], 'w') as f:
            f.write('export interface FamousGame {\n  year: number\n  white: string\n  black: string\n  name: string\n}\n\n')
            f.write('export const famousGames: FamousGame[] = [\n]\n')


def append_entry(filepath, entry_str):
    """Append an entry to a TypeScript array."""
    with open(filepath, 'r') as f:
        content = f.read()
    # Insert before the closing ]
    idx = content.rfind(']')
    if content[idx-1] == '[':
        # Empty array
        new_content = content[:idx] + '\n  ' + entry_str + ',\n' + content[idx:]
    else:
        new_content = content[:idx] + '  ' + entry_str + ',\n' + content[idx:]
    with open(filepath, 'w') as f:
        f.write(new_content)


def git_commit(date, message):
    """Create a backdated git commit."""
    hour = random.randint(8, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    ts = f"{date}T{hour:02d}:{minute:02d}:{second:02d}+03:00"

    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = ts
    env['GIT_COMMITTER_DATE'] = ts

    subprocess.run(['git', 'add', '-A'], check=True)
    subprocess.run(['git', 'commit', '-m', message, '--allow-empty'], env=env, check=True,
                   capture_output=True)


def main():
    init_files()

    # Build pools of items to add
    endgame_pool = list(ENDGAMES)
    principle_pool = list(PRINCIPLES)
    famous_pool = list(FAMOUS_GAMES)

    total_commits = 0
    endgame_idx = 0
    principle_idx = 0
    famous_idx = 0

    for date in GAP_DATES:
        # Random number of commits per day (weighted)
        r = random.random()
        if r < 0.35:
            num_commits = random.randint(1, 2)
        elif r < 0.65:
            num_commits = random.randint(3, 5)
        elif r < 0.85:
            num_commits = random.randint(6, 8)
        else:
            num_commits = random.randint(9, 12)

        for _ in range(num_commits):
            # Cycle through the three data types
            choice = random.choice(['endgame', 'principle', 'famous'])

            if choice == 'endgame':
                item = endgame_pool[endgame_idx % len(endgame_pool)]
                endgame_idx += 1
                entry = f'{{ name: "{item["name"]}", fen: "{item["fen"]}" }}'
                append_entry(FILES['endgames'], entry)
                name = item['name']
                item_type = 'endgame position'
            elif choice == 'principle':
                item = principle_pool[principle_idx % len(principle_pool)]
                principle_idx += 1
                entry = f'{{ category: "{item["category"]}", tip: "{item["tip"]}" }}'
                append_entry(FILES['principles'], entry)
                name = item['tip']
                item_type = 'chess principle'
            else:
                item = famous_pool[famous_idx % len(famous_pool)]
                famous_idx += 1
                entry = f'{{ year: {item["year"]}, white: "{item["white"]}", black: "{item["black"]}", name: "{item["name"]}" }}'
                append_entry(FILES['famous'], entry)
                name = f"{item['name']} ({item['year']})"
                item_type = 'famous game'

            template = random.choice(TEMPLATES)
            msg = template.format(name=name, item_type=item_type)
            git_commit(date, msg)
            total_commits += 1

        if total_commits % 100 == 0:
            print(f"  {total_commits} commits created...")

    print(f"\nDone! Created {total_commits} commits across {len(GAP_DATES)} days.")


if __name__ == '__main__':
    main()
