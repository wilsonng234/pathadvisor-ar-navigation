import requests
import json
from pathlib import Path
import base64

# The path to the JSON file containing the floors data
input_file_path = './src/frontend/assets/floor/floor_response.json'
output_file_path = './src/frontend/assets/mapTileImg/output'
LOGIC_MAP_TILE_WIDTH = 200;
LOGIC_MAP_TILE_HEIGHT = 200;
RENDER_MAP_TILE_WIDTH = 80;
RENDER_MAP_TILE_HEIGHT = 80;

mapTileDict={}

# Function to construct the API URL
def construct_api_url(floor_id, x, y, zoom_level):
    return f"https://pathadvisor.ust.hk/api/floors/{floor_id}/map-tiles?x={x}&y={y}&zoomLevel={zoom_level}"

def get_map_tile_start_coordinates(floor):
    tile_start_x = (floor['startX'] // LOGIC_MAP_TILE_WIDTH) * LOGIC_MAP_TILE_WIDTH
    tile_start_y = (floor['startY'] // LOGIC_MAP_TILE_HEIGHT) * LOGIC_MAP_TILE_HEIGHT
    return tile_start_x, tile_start_y

def get_map_tile_end_coordinates(floor):
    end_x = floor['startX'] + floor['mapWidth']
    end_y = floor['startY'] + floor['mapHeight']
    tile_end_x = -(-end_x // LOGIC_MAP_TILE_WIDTH) * LOGIC_MAP_TILE_WIDTH  # Ceiling division
    tile_end_y = -(-end_y // LOGIC_MAP_TILE_HEIGHT) * LOGIC_MAP_TILE_HEIGHT  # Ceiling division
    return tile_end_x, tile_end_y

def get_map_tiles_number(floor, x=None, y=None):
    tile_start_x, tile_start_y = get_map_tile_start_coordinates(floor)
    if x is None or y is None:
        tile_end_x, tile_end_y = get_map_tile_end_coordinates(floor)
        x, y = tile_end_x, tile_end_y
    num_row = (y - tile_start_y) // LOGIC_MAP_TILE_HEIGHT
    num_col = (x - tile_start_x) // LOGIC_MAP_TILE_WIDTH
    return num_row, num_col

def getMapTileBlocksByFloorId(floor, floor_id):
    tile_start_x, tile_start_y = get_map_tile_start_coordinates(floor)
    num_row, num_col = get_map_tiles_number(floor)
    
    map_tile_blocks = []
    
    for i in range(num_row):
        row = []
        for j in range(num_col):
            map_tile_block = {
                'floorId': floor_id,
                'x': j * LOGIC_MAP_TILE_WIDTH + tile_start_x,
                'y': i * LOGIC_MAP_TILE_HEIGHT + tile_start_y,
                'zoomLevel': 0
            }
            row.append(map_tile_block)
        map_tile_blocks.append(row)
    
    return map_tile_blocks

with open(input_file_path, 'r') as file:
    floors_dict = json.load(file)

for floor in floors_dict['data']:
    mapTileBlocks = getMapTileBlocksByFloorId(floor, floor['_id']) 
    for row in mapTileBlocks:
        for mapTileBlock in row:
            api_url = construct_api_url(mapTileBlock['floorId'], mapTileBlock['x'], mapTileBlock['y'], mapTileBlock['zoomLevel'])
            response = requests.get(api_url)
            if response.status_code == 200:
                image_path = f"{floor['_id']}_{mapTileBlock['x']}_{mapTileBlock['y']}_{mapTileBlock['zoomLevel']}"
                base64_encoded_string = base64.b64encode(response.content).decode('utf-8')
                mapTileDict[image_path] = base64_encoded_string
            else:
                print(f'Failed to retrieve data for floor {mapTileBlock["floorId"]}, status code: {response.status_code}')             

json_data = json.dumps(mapTileDict, indent=4)
with open('./src/frontend/assets/mapTileImg/mapTileDict.json', 'w') as file:
    file.write(json_data)