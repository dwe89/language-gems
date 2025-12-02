import base64
import os

input_path = '/Users/home/Documents/Projects/language-gems-recovered/worksheet_factory/logo.png'
output_path = '/Users/home/Documents/Projects/language-gems-recovered/worksheet_factory/logo_base64.txt'

with open(input_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Split into lines for easier reading
chunk_size = 80
with open(output_path, "w") as text_file:
    for i in range(0, len(encoded_string), chunk_size):
        text_file.write(encoded_string[i:i+chunk_size] + "\n")

print(f"Encoded {len(encoded_string)} bytes to {output_path}")
