import scrapy
import requests
import json
from ..utils import utils
from ..settings import pexels_url


class PexelsSpider(scrapy.Spider):

    name = 'pexels'

    headers = {
            'authority': 'www.pexels.com',
            'accept': '*/*',
            'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'pragma': 'no-cache',
            'referer': 'https://www.pexels.com/search/landscape/',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'secret-key': 'H2jk9uKnhRmL6WPwh89zBezWvr',
            'sentry-trace': 'ff29fdfc25cc408392bce67a5b587d54-bb47113dd349fb6a-0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        }
    
    init_url         = 'https://www.pexels.com/'
    photo_detail_api = 'https://www.pexels.com/en-us/api/v3/media/{}/details/'
    photo_detail_url = 'https://www.pexels.com/photo/'

    def start_requests(self):

        tag = self.tag
        
        for i in range(0, 11):
            url = pexels_url.format(i, tag)
            yield scrapy.Request(
                url = url,
                headers = {
                    **self.headers,
                    'user-agent': utils.random_user_agent()
                },
                callback = self.get_all_photo
            )
        

    def get_all_photo(self, response):

        data   = json.loads(response.body)
        photos = data['data']
        
        for photo in photos:
            item = {}
           

            photo_id   = photo['id']
            owner_id   = photo['attributes']['user']['id']   
            image_urls = [ photo['attributes']['image']['download'] ] 
            image = f"{self.name}/{photo_id}/{owner_id}" #

            slug = photo['attributes']['slug']
            page = f"{self.photo_detail_url}/{slug}-{photo_id}"

            tags     = [ x['name'] for x in photo['attributes']['tags'] ]   
            license  = photo['attributes']['license']
            #uploaded = photo['attributes']['created_at']
            owner    = photo['attributes']['user']['username'] 
            title    = photo['attributes']['title']

            item = {
                **item,
                'image'   : image,
                'page'    : page,
                'tags'    : tags,
                'license' : license,
                #'uploaded':uploaded,
                'owner'   : owner,
                'title'   : title,
                
                

                'image_urls': image_urls
            }

    def get_exif(self,response):
        return  

    def get_remain_info(self, response):
        return

    def print(self, response):
        item = {}
        yield {
            "image"      : item['image'],                        # Specify the name of the image (we can point out the image_id and owner_id)
            "source"     : self.init_url,                        # Specify the source
            "page"       : item['page'],                         # Specify the url
            #"exif"       : item['exif'],                         # Specify the exif of the image: make, model, lens, shutterspeed, fstop, iso, focallength
            #"stat"       : item['stat'],                         # Specify the statistic based on client's requirements: downloads, views, likes comments
            "tags"       : item['tags'],                         # Specify all tags having on website of this image
            "license"    : item['license'],                      # Specify the lisence on the image website
            "uploaded"   : item['uploaded'],                     # Specify the date of image uploaded
            "owner"      : item['owner'],                        # Specify the owner of the image
            "title"      : item['title'],                        # Specify the title of image
            #"gps"        : item['gps'],                          # Specify the longtitude and latitude
            #"size"       : item['size'],                         # Specify all sizes of this image
            "root_class" : self.tag,                             # Specify the root_class (the tag when you search for it)
            "sub_class"  : ["landscape", "mountain", "nature"],  # Specify some subclass of the image
            #"rating"     : "",                                   # Specify the rating of the image
            #"crawl_id"   : 1,                                    # Generate crawl id
            "crawl_note" : "No",                                 # Generate crawl note
            #"crawl_count": self.count,                          # Crawl Count Is Set Based on the Pipelines

            "image_urls" : item['image_urls']                    # Field to download image
        }
            
