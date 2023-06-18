import scrapy
import os
import glob
import json
import base64

class IndexSpider(scrapy.Spider):

    name = "upload_image"

    def start_requests(self):

        tag = self.tag

        # Get the absolute path of the current script
        script_path = os.path.abspath(__file__)

        # Get the directory containing the script
        script_directory = os.path.dirname(script_path)

        # Construct the path to the public folder
        public_folder_path = os.path.join(
            script_directory, 
            '..', '..', '..', 'upload_image_server', 
            'public',
            tag,
            'images'
        )


        if not os.path.exists(public_folder_path): return

        # Get all the images
        image_file_paths = glob.glob(os.path.join(public_folder_path,'*'))

        for image_file_path in image_file_paths:
            
            content_type = 'image/jpeg' if image_file_path.endswith('.jpg') else 'image/png'

            with open(image_file_path, 'rb') as file:
                file_content = file.read()

            file_content_base64 = base64.b64encode(file_content).decode('utf-8')

            image_name = os.path.basename(image_file_path)

            long_exposure = ''
            if self.tag == 'long_exposure':
                long_exposure = 'long exposure'
            else:
                tag = self.tag
        
            # Construct the FormRequest
            form_data = {
                'file': (image_name, file_content_base64, content_type),
                'root_class': long_exposure if long_exposure else tag
            }

             # Create a FormData instance
            yield scrapy.FormRequest(
                url='http://localhost:3001/upload',
                method = "POST",
                formdata=form_data,
                callback=self.parse,
                meta={
                    'root_class': tag,
                    'image_name': image_name
                }
            )

    def parse(self, response):

        root_class = response.meta['root_class']
        data       = json.loads(response.body)

        image         = data['image']
        thumbnail_url = data['thumbnail_url']
        
        yield {
            'root_class'   : root_class,
            'image'        : image,
            'thumbnail_url': thumbnail_url
        }
        
