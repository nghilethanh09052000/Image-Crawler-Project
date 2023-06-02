# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy import Request
from scrapy.pipelines.images import ImagesPipeline
from scrapy.exceptions import DropItem
import pymongo
from .utils import utils
import os
from PIL import Image
from PIL import ImageFile
from .settings import limit, MONGO_DB_URL, MONGO_DB_DATABASE, COLLECTION_NAME, HI_RES_IMAGES_STORE, RESIZE_IMAGES_STORE, METADATA_STORE ,IMAGES_MIN_HEIGHT, IMAGES_MIN_WIDTH
import json
from scrapy.exceptions import CloseSpider



ImageFile.LOAD_TRUNCATED_IMAGES = True

class MongoDBPipeline():
     
    def open_spider(self, spider):

        self.client = pymongo.MongoClient(MONGO_DB_URL)
        self.db = self.client[MONGO_DB_DATABASE]
    
    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[COLLECTION_NAME].insert_one(item) # Unrem for production
        del item['_id'] 
        return item
 

class DownloadImagePipeline(ImagesPipeline):

    def __init__(self, store_uri, download_func=None, settings=None):
        count = 0
        self.count = count
        super().__init__(store_uri, download_func, settings)


    def get_media_requests(self, item, info):

        return [
            Request(
            x, 
            meta = {
                'image_name': item.get('image'),
                'tag'       : item.get('root_class')
            }
            ) for x in item.get(self.images_urls_field, [])
        ] 
    
    def file_path(self, request, response=None, info=None, *, item=None):

        image_name    = request.meta['image_name']
        tag           = request.meta['tag']

        image_urls     = item.get(self.images_urls_field, [])
        file_extension = os.path.splitext(image_urls[0])[1]

        file_location = f'{HI_RES_IMAGES_STORE.format(tag)}' + '\\' + f'{image_name}{file_extension}'     
        return file_location
   
    
    def item_completed(self, results, item, info):
        
        status = [ x['status'] for ok, x in results if ok ] # Downloaded is list ['downloaded'] or [] for failure

        if len(status) == 0:
            raise DropItem("Image has not been downloaded")
        
        image_paths = [ x['path'] for ok, x in results if ok ]
        init_image_name = os.path.basename(image_paths[0])

        # Get the file extension from the image name
        file_extension = os.path.splitext(init_image_name)[1]

        self.count += 1
        item['crawl_count'] = self.count

        image_path = image_paths[0]
        try:
            img                = Image.open(image_path)
            cropped_img        = self.crop_image(img)
            resized_img        = self.resize_image(cropped_img)
            root_class         = item.get('root_class')
            image_name         = f"{item.get('image')}{file_extension}"
            resized_folder     = RESIZE_IMAGES_STORE.format(root_class)
            resized_image_path = os.path.abspath(os.getcwd())+'\\'+f'{resized_folder}'

            if not os.path.exists(resized_image_path): os.makedirs(resized_image_path)
            saved_image_path = os.path.join(resized_image_path, image_name)
            resized_img.save(saved_image_path)        

            # Delete The Image Path
            if os.path.exists(saved_image_path):
                os.remove(image_path)

            return item    
        
        except OSError as error:
            print(f"{error} ({image_path})")
            with open("./error_file_list.txt", "a") as error_log:
                error_log.write(str(image_path))

    def crop_image(self, image):
        width, height = image.size

        # Calculate the center coordinate
        left   = (width - min(width, height)) // 2
        top    = (height - min(width, height)) // 2
        right  = left + min(width, height)
        bottom = top + min(width, height)

        cropped_image = image.crop((left, top, right, bottom))
        return cropped_image
    
    def resize_image(self, image):
        return image.resize((IMAGES_MIN_HEIGHT, IMAGES_MIN_WIDTH))
    

class JsonFilePipeLine():

    def open_spider(self, spider):
        self.init_path = os.path.abspath(os.getcwd())
    
    def process_item(self, item, spider):

        FULL_METADATA_PATH = METADATA_STORE.format(item.get('root_class'))
        metadata_location  = self.init_path + '\\' + f'{FULL_METADATA_PATH}'

        if not os.path.exists(metadata_location): os.makedirs(metadata_location) 

        file_name          = f"{item.get('image')}.json" 
        file_path          = os.path.join(metadata_location, file_name)   

        with open(file_path, 'w', encoding="utf-8") as file:
            json.dump(item, file)
        return item