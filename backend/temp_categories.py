import re
import json

file_path = r'f:\Project 001\qr code generator 6\frontend\src\data\templates.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make Template interface accept category
content = content.replace('description?: string;', 'description?: string;\n  category?: string;')

categories = {
    'Food & Dining': ['Artisan Cafe Menu', 'Slice Pizzeria', 'Food Cloche Dome', 'Coffee Mug Frame', 'Warm Coffee Cup', 'Blue Juice Cup'],
    'Business & Events': ['Premium Real Estate', 'VIP Event Access', 'Heavy Lifter Gym Pass', 'Elegant Wedding RSVP', 'VIP Ticket Stub', 'Red Ribbon Banner', 'Vantage Price Tag', 'Best Seller Badge', 'Postage Stamp'],
    'Social & Digital': ['Tech App Download', 'Instagram Sunset Dots', 'Instagram Sunset Card', 'Instagram Banner Poster', 'Facebook Royal Blue Frame', 'Facebook Blue Banner Card', 'Discord Dark Mode', 'Discord Soft Blue Gradient', 'LinkedIn Banner Card', 'Threads Black Canvas', 'Google 4-Color Brand Card', 'Web Browser'],
    'Creative & Misc': ['None', 'Black Pill Badge', 'Blue Header Tab', 'Orange Outline Card', 'Red Phone Footer Card', 'Black Glossy Header Card', 'Black Canvas Dark Mode', 'Blue Speech Bubble', 'Green Leaf', 'Pink Dotted', 'Blue Circle Sprinkles', 'Purple Rate Us Tab', 'Orange Shopping Bag', 'Retro Polaroid']
}

name_to_cat = {}
for cat, names in categories.items():
    for name in names:
        name_to_cat[name] = cat

def replacer(match):
    name_line = match.group(0)
    # Extract the name value
    name_match = re.search(r'\"name\":\s*\"([^\"]+)\"', name_line)
    if name_match:
        name = name_match.group(1)
        cat = name_to_cat.get(name, 'Creative & Misc')
        return name_line + f',\n    \"category\": \"{cat}\"'
    return name_line

# Find the name lines and append category
content = re.sub(r'^\s*\"name\":\s*\"[^\"]+\"', replacer, content, flags=re.MULTILINE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
