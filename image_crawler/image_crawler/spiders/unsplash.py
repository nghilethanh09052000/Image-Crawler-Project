import scrapy
from ..settings import unsplash_api, unsplash_views
import json
from datetime import datetime
from scrapy import Selector
from ..utils import utils
class UnsplashSpider(scrapy.Spider):
    http = 'user'
    
    name = 'unsplash'
    init_url = 'https://unsplash.com'
    headers = {
            'Accept'            : '*/*',
            'Accept-Encoding'   : 'gzip, deflate, br',
            'Accept-Language'   : 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type'      : 'application/json',
            'Cookie'            : '_gid=GA1.2.1420527175.1685445543; _gaexp=GAX1.2.AmY7B07tRkCVpPsRffgdLg.19599.0; _sp_ses.9ec1=*; country-code-v2=VN; OptanonConsent=isGpcEnabled=0&datestamp=Tue+May+30+2023+18%3A19%3A04+GMT%2B0700+(Indochina+Time)&version=202301.1.0&isIABGlobal=false&hosts=&landingPath=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Flandscape%2F&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1; ab.storage.deviceId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%228ce43820-4f66-a123-8c04-bc9fa2fc2cc3%22%2C%22c%22%3A1685445544130%2C%22l%22%3A1685445544130%7D; ab.storage.sessionId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%222ee51e46-eb01-c857-cee2-24165226feef%22%2C%22e%22%3A1685447344148%2C%22c%22%3A1685445544125%2C%22l%22%3A1685445544148%7D; _hjSessionUser_171201=eyJpZCI6ImFhMDU2MzMwLWQ2ZTQtNWY3ZC05ZWQyLTNlMGJlMDZlOGM4MiIsImNyZWF0ZWQiOjE2ODU0NDU1NDQ5NDksImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjIncludedInSessionSample_171201=0; _hjSession_171201=eyJpZCI6IjczMDJiOTliLTU1YTAtNDQxNy04NDk0LWIyOWEwY2QyNWVlYyIsImNyZWF0ZWQiOjE2ODU0NDU1NDQ5NjcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; __cf_bm=xP_kW_fMs85Yy8ziqmNgvd3VJgTpjKn3bXADMTlPfnw-1685445545-0-Afvr6GSMNcY6F001g9NbOM8Rydb/yzQdBZy7zDBDPGNbBq05ngg//gSxWQAQ3N1jAkc8lETXznjV8NdHor5QvYXnG0bPbBAvSLVBR22G1I+uwRq9LJWX7StZU8FYP10Tdgi0+AvSIxUfQJ6tox2lz6g=; _ga=GA1.1.1693057861.1685445543; _fbp=fb.1.1685445551503.1989190604; _ga_8JE65Q40S6=GS1.1.1685445545.1.1.1685445815.0.0.0; _sp_id.9ec1=f281332d-b374-4f5c-ad56-9a8bff982790.1685445543.1.1685445830..9fdbad95-28ef-4067-b515-e2231965c048..7cc0554b-6c57-46f0-a89f-df29b1fdcd46.1685445543430.14',
            'If-None-Match'     : 'W/"d133f3bbb0577edce554d3846a56b6cb"',
            'User-Agent'        : utils.random_user_agent(),
    }  
    photo_detail_api = 'https://unsplash.com/napi/photos/{}'

    def format_datetime(self, date_string):      
        datetime_obj   = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
        fomartted_date = datetime_obj.strftime("%Y-%m-%d")
        return fomartted_date
    
    def get_image_size(self, image_dict, initial_width, initial_height):
        size   = []
        for value in list(image_dict.values()):
            width  = 0
            height = 0
            if '&w=' in value:
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
        for i in range(1, 600):
            yield scrapy.Request(
                url = unsplash_api.format(tag,i),
                headers= self.headers,
                callback = self.get_all_photos
            )

    def get_all_photos(self, response):
        
        data = json.loads(response.body)
        photos = data['results']

        for photo in photos:

            item     = {}
            width    = photo['width']
            height   = photo['height']

            photo_id = photo['id']
            owner_id = photo['user']['id']
            owner    = photo['user']['username']
            image    = f'{self.name}_{photo_id}_{owner_id}'
            page     = photo['links']['html']
            uploaded = self.format_datetime(photo['created_at'])
            size = self.get_image_size(photo['urls'], width, height )
            size.append({
                'url'   : photo['urls']['full'],
                'height': height,
                'width' : width 
            })

            image_urls = [ size[0].get('url') ]

            item = {
                **item,
                'image': image,
                'page': page,
                'uploaded': uploaded,
                'owner': owner,
                'size': size,
                'image_urls': image_urls
            }

            yield scrapy.Request(
                url = self.photo_detail_api.format(photo_id),
                callback = self.get_photo_details,
                meta = {
                    'item': item
                }
            )
    
    def get_photo_details(self, response):

        item  = response.meta['item']
        photo = json.loads(response.body)

        exif  = photo.get('exif')
        # Return if don't have exif or all values of exif are null
        if (
            not exif 
            or
            all(value is None for value in exif.values())
        ) : return

        views = int(photo['views'])
        # Return when views don't match condition
        if not (views >= unsplash_views): return

        likes = int(photo['likes'])
        download = int(photo['downloads'])
        stat = {
            'views'   : views,
            'likes'   : likes,
            'download': download,
            'comments': None
        }

        exif = {
            'make'         : exif.get('make') or "",
            'model'        : exif.get('model') or "",
            'shutterspeed' : f"{exif.get('exposure_time')}s" or "",
            'fstop'        : f"f/{exif.get('aperture')}" or "",
            'iso'          : str(exif.get('iso')) or "",
            'focallength'  : f"{exif.get('focal_length')}mm" or "",
            "lens"         : ""
        }

        title = photo['alt_description']

        position = photo['location']['position']
        gps = {
            'latitude': position.get('latitude') or 0,
            'longitude': position.get('longitude') or 0
        }

        tags = [ tag.get('title') for tag in photo['tags'] ]
        license = ""

        item = {
            **item,
            'exif': exif,
            'stat': stat,
            'tags': tags,
            'license': license,
            'title': title,
            'gps': gps,        
        }
 
        yield {
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

            "image_urls" : item['image_urls'],                   # Field to download image
        }