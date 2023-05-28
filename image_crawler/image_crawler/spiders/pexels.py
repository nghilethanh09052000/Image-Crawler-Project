import scrapy
import json
from ..utils import utils
from ..settings import pexels_url
from datetime import datetime
from urllib.parse import urlencode

import time


class PexelsSpider(scrapy.Spider):


    name = 'pexels'
    headers = {
            'Accept'            : '*/*',
            'Accept-Encoding'   : 'gzip, deflate, br',
            'Accept-Language'   : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type'      : 'application/json',
            'If-None-Match'     : 'W/"d133f3bbb0577edce554d3846a56b6cb"',
            'Referer'           : 'https://www.pexels.com/search/landscape/',
            'Sec-Ch-Ua'         : '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'Sec-Ch-Ua-Mobile'  : '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest'    : 'empty',
            'Sec-Fetch-Mode'    : 'cors',
            'Sec-Fetch-Site'    : 'same-origin',
            'Secret-Key'        : 'H2jk9uKnhRmL6WPwh89zBezWvr',
            'Sentry-Trace'      : '9522afbb61bf42949c1f37ecf2a456f2-aa7fc739c0c1bc30-0',
            'User-Agent'        : utils.random_user_agent(),
            'X-Client-Type'     : 'react'
    }  
    photo_detail_api = 'https://www.pexels.com/en-us/api/v3/media/{}/details'
    photo_static_api = 'https://www.pexels.com/en-us/api/v3/media/{}/stats'
    init_url         = 'https://www.pexels.com/'
    image_url        = 'https://images.pexels.com/photos/{}/pexels-photo-{}.jpeg'
    photo_detail_url = 'https://www.pexels.com/photo'
    

    def format_datetime(self, date_string):      
        datetime_obj   = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ" )
        fomartted_date = datetime_obj.strftime("%Y-%m-%d")
        return fomartted_date
    
    def get_image_size(self, image_dict, initial_width, initial_height):

        size   = []
        for value in list(image_dict.values()):
            width  = 0
            height = 0
            if '&h=' in value:
                height = int(value.split('&h=')[-1])
                ratio  = initial_height / height
                width  = int(initial_width / ratio)
            elif '&w=' in value:
                width  = int(value.split('&w=')[-1])
                ratio  = initial_width / width
                height = int(initial_height / ratio)
            else:
                continue
            url = value
            size.append({
                'width'  : width,
                'height' : height,
                'url'    : url
            })
        return size

    def start_requests(self):

        tag = self.tag    

        for i in range(1, 51):
            url = pexels_url.format(i, tag)
            yield scrapy.Request(
                url = url,
                headers = self.headers,
                callback = self.get_all_photos
            )
        
    def get_all_photos(self, response):

        data   = json.loads(response.body)
        photos = data['data']
        
        for photo in photos:
            item = {}
 
            photo_id   = photo['id']
            owner_id   = photo['attributes']['user']['id']   
            image_urls = [ photo['attributes']['image']['download_link'] ] 
            image = f"{self.name}_{photo_id}_{owner_id}" 

            slug = photo['attributes']['slug']
            page = f"{self.photo_detail_url}/{slug}-{photo_id}"

            tags     = [ x['name'] for x in photo['attributes']['tags'] ]   
            license  = photo['attributes']['license']
            uploaded = self.format_datetime(photo['attributes']['created_at']) # 2019-05-13T04:50:50.000Z
            owner    = photo['attributes']['user']['username'] 
            title    = photo['attributes']['title']


            width  = int(photo['attributes']['width'])
            height = int(photo['attributes']['height'])
   
            size   = self.get_image_size(photo['attributes']['image'], width, height)
            size.append({
                'width': width,
                'height': height,
                'url': f"{self.image_url.format(photo_id, photo_id)}"
            })

            item = {
                **item,
                'image'   : image,
                'page'    : page,
                'tags'    : tags,
                'license' : license,
                'uploaded': uploaded,
                'owner'   : owner,
                'title'   : title,
                'size'    : size,

                'image_urls': image_urls
            }

            yield scrapy.Request(
                url = f'{self.photo_detail_api.format(photo_id)}', # https://www.pexels.com/en-us/api/v3/media/808465/details
                headers = self.headers,
                callback=  self.get_exif_and_gps,
                meta = {
                    'item'    : item,
                    'photo_id': photo_id
                } 
            )

    def get_exif_and_gps(self, response):

        exif     = {}
        gps      = {}
        item     = response.meta['item']
        photo_id = response.meta['photo_id']
        data     = json.loads(response.body)
        photo    = data['data'] if 'data' in data else None
        
        # Return when don't have any data
        if not photo: return

        # Continue the process
        attributes = photo['attributes']

        make         = ""
        model        = ""
        shutterspeed = ""
        fstop        = ""
        iso          = ""
        focallength  = ""
        lens         = ""
        
        for key, value in attributes.items() :
            if key =='manufacturer':
                make = value
            elif key =='camera':
                model = value
            elif key =='shutter_speed':
                shutterspeed = value
            elif key =='aperture':
                fstop = value
            elif key =='iso':
                iso = value     
            elif key =='focal_length':
                focallength = value 
                
            exif = {}
            if make or model or shutterspeed or fstop or iso or focallength:     
                exif = {
                    'make'         : make if (make is not None and len(make) > 0) else "",
                    'model'        : model if (model is not None and len(model) > 0) else "",
                    'shutterspeed' : f'{shutterspeed}s' if (shutterspeed is not None and len(shutterspeed) > 0) else "",
                    'fstop'        : f'f/{fstop}' if (fstop is not None and len(fstop) > 0) else "",
                    'iso'          : str(iso) if (iso is not None) else "",
                    'focallength'  : f'{focallength}mm' if (focallength is not None and len(focallength) > 0) else "",
                    'lens'         : lens
                }
        if not bool(exif): return
        
        latitude  = attributes.get('latitude')
        longitude = attributes.get('longitude')
        gps = {
            **gps,
            "latitude" : latitude  if latitude is not None else 0 ,
            "longitude": longitude if longitude is not None else 0
        }

        item = {
            **item,
            'exif': exif,
            'gps' : gps
        }
        
        yield scrapy.Request(
            url = f'{self.photo_static_api.format(photo_id)}', # https://www.pexels.com/en-us/api/v3/media/808465/stats
            headers = self.headers,
            callback =  self.get_photo_stats,
            meta = {
                'item'    : item,
                'photo_id': photo_id
            } 
        )
      
    def get_photo_stats(self, response):

        item       = response.meta['item']
        data       = json.loads(response.body)
        photo      = data['data'] 
        attributes = photo['attributes']
        
        views     = attributes['views']
        likes     = attributes['likes']
        downloads = attributes['downloads'] 

        stat = {
            'views': views,
            'likes': likes,
            'downloads': downloads,
            "comments": None
        }     

        item = {
            **item,
            'stat': stat
        }

        item = self.process_data(item)
        yield item

    def process_data(self, item):



        return {
            "image"      : item['image'],                        # Specify the name of the image (we can point out the image_id and owner_id)
            "source"     : self.init_url,                        # Specify the source
            "page"       : item['page'],                         # Specify the url
            "exif"       : item['exif'],                         # Specify the exif of the image: make, model, lens, shutterspeed, fstop, iso, focallength
            "stat"       : item['stat'],                         # Specify the statistic based on client's requirements: downloads, views, likes comments
            "tags"       : item['tags'],                         # Specify all tags having on website of this image
            "license"    : item['license'],                      # Specify the lisence on the image website
            "uploaded"   : item['uploaded'],                     # Specify the date of image uploaded
            "owner"      : item['owner'],                        # Specify the owner of the image
            "title"      : item['title'],                        # Specify the title of image
            "gps"        : item['gps'],                          # Specify the longtitude and latitude
            "size"       : item['size'],                         # Specify all sizes of this image
            "root_class" : self.tag,                             # Specify the root_class (the tag when you search for it)
            "sub_class"  : ["landscape", "mountain", "nature"],  # Specify some subclass of the image
            "rating"     : None,                                 # Specify the rating of the image
            "crawl_id"   : 1,                                    # Generate crawl id
            "crawl_note" : "No",                                 # Generate crawl note
            #"crawl_count": self.count,                          # Crawl Count Is Set Based on the Pipelines

            "db_name"    : self.name,                            # Field for testing
            "image_urls" : item['image_urls']                    # Field to download image
        }
            
