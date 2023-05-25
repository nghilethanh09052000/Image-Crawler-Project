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
from .settings import MONGO_DB_URL, MONGO_DB_DATABASE, COLLECTION_NAME, HI_RES_IMAGES_STORE, RESIZE_IMAGES_STORE, METADATA_STORE ,IMAGES_MIN_HEIGHT, IMAGES_MIN_WIDTH





class MongoDBPipeline():
     
    def open_spider(self, spider):
        self.client = pymongo.MongoClient(MONGO_DB_URL)
        self.db = self.client[MONGO_DB_DATABASE]
    
    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[COLLECTION_NAME].insert_one(item)
        
        del item['_id'] 
        del item['image_urls']
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
        file_location = f'{HI_RES_IMAGES_STORE.format(tag)}' + '\\' + f'{image_name}.jpg'     
        return file_location
    
    def item_completed(self, results, item, info):
        
        status = [ x['status'] for ok, x in results if ok ] # Downloaded is list ['downloaded'] or []

        if len(status) == 0:
            raise DropItem("Image has not been downloaded")
        
        image_paths = [ x['path'] for ok, x in results if ok ]
        self.count += 1
        item['crawl_count'] = self.count
        
        image_path = image_paths[0]

        if os.path.exists(image_path):
            img                = Image.open(image_path)
            cropped_img        = self.crop_image(img)
            resized_img        = self.resize_image(cropped_img)
            root_class         = item.get('root_class')
            image_name         = f"{item.get('image')}.jpg"
            resized_folder     = RESIZE_IMAGES_STORE.format(root_class)
            resized_image_path = os.path.abspath(os.getcwd())+'\\'+f'{resized_folder}'

            if not os.path.exists(resized_image_path): os.makedirs(resized_image_path)
            resized_img.save(os.path.join(resized_image_path, image_name))

        return item

    def crop_image(self, image):
        width, height = image.size

        # Calculate the center coordinate
        # left   = (width -  IMAGES_MIN_WIDTH) // 2
        # top    = (height - IMAGES_MIN_HEIGHT) // 2
        # right  = (width + IMAGES_MIN_WIDTH) // 2
        # bottom = (height + IMAGES_MIN_HEIGHT) // 2

        left = (width - min(width, height)) // 2
        top = (height - min(width, height)) // 2
        right = left + min(width, height)
        bottom = top + min(width, height)

        cropped_image = image.crop((left, top, right, bottom))
        return cropped_image
    
    def resize_image(self, image):
        return image.resize((IMAGES_MIN_HEIGHT, IMAGES_MIN_WIDTH))
    

class TextFilePipeLine():

    def open_spider(self, spider):
        self.init_path = os.path.abspath(os.getcwd())
    
    def process_item(self, item, spider):

        FULL_METADATA_PATH = METADATA_STORE.format(item.get('root_class'))
        metadata_location  = self.init_path + '\\' + f'{FULL_METADATA_PATH}'

        if not os.path.exists(metadata_location): os.makedirs(metadata_location) 

        file_name          = f"{item.get('image')}.txt" 
        file_path          = os.path.join(metadata_location, file_name)   

        with open(file_path, 'w', encoding="utf-8") as file:
            file.write(str(item))
        return item