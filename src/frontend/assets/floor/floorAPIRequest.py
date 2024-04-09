import requests
import os

# Replace 'your_api_url' with the actual URL of the API you want to call
API_URL = 'https://pathadvisor.ust.hk/api/floors'

# The directory where you want to store the JSON file
# Replace 'your_directory_path' with the path to the directory
output_directory = './src/frontend/assets/floor'

# The name of the JSON file you want to store the response in
file_name = 'floor_response.json'

# Make a GET request to the API
response = requests.get(API_URL)

# Check if the request was successful
if response.status_code == 200:
    # Ensure the output directory exists
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # Construct the full file path
    file_path = os.path.join(output_directory, file_name)
    
    # Write the JSON data to the file
    with open(file_path, 'w') as file:
        # The `indent` parameter is optional, it makes the file human-readable
        file.write(response.text)
        
    print(f'JSON data has been written to {file_path}')
else:
    print(f'Failed to retrieve data, status code: {response.status_code}')