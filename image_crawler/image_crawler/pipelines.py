# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy import Request
from scrapy.pipelines.images import ImagesPipeline
import pymongo
from .utils import utils
import os
from PIL import Image
from .settings import MONGO_DB_URL, MONGO_DB_DATABASE, COLLECTION_NAME, HI_RES_IMAGES_STORE, RESIZE_IMAGES_STORE, IMAGES_MIN_HEIGHT, IMAGES_MIN_WIDTH

class MongoDBPipeline():
     

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(MONGO_DB_URL)
        self.db = self.client[MONGO_DB_DATABASE]
    
    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[COLLECTION_NAME].insert_one(item)
        
        del item['_id'] 
        return item
 

class FlickrDownloadImagePipeline(ImagesPipeline):

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

        FULL_IMAGES_STORE        = HI_RES_IMAGES_STORE.format(item.get('root_class'))
        hi_re_file_location      = os.path.abspath(os.getcwd())+ '\\' +f'{FULL_IMAGES_STORE}'+ '\\' +f'{item["image"]}.jpg'
        img                      = Image.open(hi_re_file_location)    
        FULL_RESIZE_IMAGES_STORE = RESIZE_IMAGES_STORE.format(item.get('root_class'))
        resize_file_location     = os.path.abspath(os.getcwd())+'\\'+f'{FULL_RESIZE_IMAGES_STORE}'
        
 
        if not os.path.exists(resize_file_location): os.makedirs(resize_file_location)
            
        resize_img = img.resize((IMAGES_MIN_WIDTH, IMAGES_MIN_HEIGHT))

        resize_img.save(os.path.abspath(os.getcwd())+'\\'+f'{FULL_RESIZE_IMAGES_STORE}' +'\\'+ f'{item["image"]}.jpg')

        # print('Nghi',{
        #     results,
        #     item
        # })

        return item