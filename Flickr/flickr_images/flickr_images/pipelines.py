# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy import Request
from scrapy.pipelines.images import ImagesPipeline
import pymongo
from .utils import utils



class MongoDBPipeline(object):
     
    collection_name = 'best_images'

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(utils.MONGO_DB_URL)
        self.db = self.client[utils.MONGO_DB_DATABASE]
    
    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[self.collection_name].insert_one(item)
        
 

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

        image_name = request.meta['image_name']
        tag        = request.meta['tag']
        return f'full/{tag}/{image_name}.jpg'

