import requests
import json

# The path to the JSON file containing the items
input_file_path = './src/frontend/assets/floor/floor_response.json'

# Replace 'your_api_url' with the actual URL of the API you want to call
API_URL = 'your_api_url'

https://pathadvisor.ust.hk/api/floors/${mapTileBlock.floorId}/map-tiles?x=999&y=${mapTileBlock.y}&zoomLevel=${mapTileBlock.zoomLevel}

# Read the JSON data from the file
with open(input_file_path, 'r') as file:
    items = json.load(file)

# Iterate over the items
for item in items:
    # Assume each item is a dictionary and we use a value from it, e.g., 'id'
    params = {
        'id': item['id']  # Replace 'id' with the actual key you need to use
    }

    # Make the API call with the parameters from the item
    response = requests.get(API_URL, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Process the response or do something with it
        api_response_data = response.json()
        print(f'Response from API for item {item["id"]}:', api_response_data)
    else:
        print(f'Failed to retrieve data for item {item["id"]}, status code: {response.status_code}')

# Add your processing code here if needed