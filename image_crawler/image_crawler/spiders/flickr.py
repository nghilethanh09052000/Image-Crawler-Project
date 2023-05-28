import scrapy
import argparse
import json
from ..settings import flickr_url, flickr_api
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import requests
from datetime import datetime

class IndexSpider(scrapy.Spider):

    name                = 'flickr'
    init_url            = 'https://www.flickr.com'
    photo_url           = 'https://www.flickr.com/photos' #  owner_id and photo_id 
    count               = 0
    tag                 = None
    flickr_api_key      = ''

    IMAGE_SIZE = {
        'url_sq' : ['height_sq', 'width_sq'],
        'url_q'  : ['height_q', 'width_q'],
        'url_t'  : ['height_t', 'width_t'],
        'url_s'  : ['height_s', 'width_s'],
        'url_n'  : ['height_n', 'width_n'],
        'url_w'  : ['height_w', 'width_w'],
        'url_m'  : ['height_m', 'width_m'],
        'url_z'  : ['height_z', 'width_z'],
        'url_c'  : ['height_c', 'width_c'],
    }
  

    # Parse API Key of the Website
    def parse_api_key(self, tag , url):
        searched_tag_url = url.format(tag)
        response         = requests.get(searched_tag_url).text
        return str(str(str(response).split('root.YUI_config.flickr.api.site_key = "')[1]).split('";')[0])
        
    # Return Date Time Format: yyyy-mm-dd
    def format_date_time(self, date_string):
        date = datetime.strptime(date_string, "%B %d, %Y")
        formatted_date_uploaded = date.strftime("%Y-%m-%d")
        return formatted_date_uploaded
      
    # Start Request
    def start_requests(self):
        tag                 = self.tag
        self.flickr_api_key = self.parse_api_key(tag, flickr_url)
        
        for i in range(1, 51):
            url = flickr_api.format(i ,tag, self.flickr_api_key)
            yield scrapy.Request(
                url = url,
                callback = self.get_all_photos
            )

    def get_all_photos(self, response, **kwargs):
            
        data   = json.loads(response.body)
        photos = data['photos']['photo']

        for photo in photos:
            item      = {}
            size      = []
            owner_id  = photo['owner']
            photo_id  = photo['id']
            image     = f"{self.name}_{photo_id}_{owner_id}" # Get this one       
            page = f'{self.photo_url}/{owner_id}/{photo_id}'

            for i in list(self.IMAGE_SIZE.keys()):
                if photo.get(i):

                    url    = photo[i]
                    height = photo[self.IMAGE_SIZE[i][0]]
                    width  = photo[self.IMAGE_SIZE[i][1]]

                    size.append({
                        'url'   :  url,
                        'height':  height,
                        'width' :  width
                    })

            item = {
                **item,
                'image': image,
                'page' : page,
                'size' : size
            }
            
            yield scrapy.Request(
                url = f'https://api.flickr.com/services/rest?photo_id={photo_id}&extras=camera&viewerNSID=&method=flickr.photos.getExif&csrf=1684682207%3Ay1fg88gisg%3Afdf5269875586aec73788ac323702395&api_key={self.flickr_api_key}&format=json&hermes=1&hermesClient=1&reqId=4d5637b6-5aee-434e-916f-ceaa7ebfae15&nojsoncallback=1',
                callback = self.get_exif,
                # cookies = utils.cookie_parser(),
                meta = {
                    'item'    : item,
                    'photo_id': photo_id,
                }
            )
            
    def get_exif(self, response):
        
        item      = response.meta['item']
        photo_id  = response.meta['photo_id']

        data      = json.loads(response.body)
        data_exif = data.get('photo').get('exif') if 'photo' in data else None


        # Only request have meta exif will be scrapped 
        if not data_exif: return

        # Continue the process
        make         = ""
        model        = ""
        shutterspeed = ""
        fstop        = ""
        iso          = ""
        focallength  = ""
        lens         = ""

        for i in data_exif:
            if i.get('tag') =='Make':
                make = i.get('raw').get('_content')
            elif i.get('tag') =='Model':
                model = i.get('raw').get('_content')
            elif i.get('tag') =='ExposureTime':
                shutterspeed = i.get('raw').get('_content')
            elif i.get('tag') =='FNumber':
                fstop = i.get('raw').get('_content')
            elif i.get('tag') =='ISO':
                iso = i.get('raw').get('_content')     
            elif i.get('tag') =='FocalLength':
                focallength = i.get('raw').get('_content')
            elif i.get('tag') == 'LensModel':
                lens = i.get('raw').get('_content')
                
            exif = {}
            if make or model or shutterspeed or fstop or iso or focallength:     
                exif = {
                        'make'        : make,
                        'model'       : model,
                        'shutterspeed': f'{shutterspeed}s' if len(shutterspeed) > 0 else shutterspeed,
                        'fstop'       : f'f/{fstop}' if len(fstop) > 0 else fstop,
                        'iso'         : iso,
                        'focallength' : focallength.replace(" ","") if len(focallength) > 0 else focallength,
                        'lens'        : lens
                    }
            
        
        # Return when exif does not have any key based on the EXIF_STANDARD standard
        if not bool(exif): return

        item = {
            **item,
            'exif': exif
        }

        yield scrapy.Request(
            url = f'https://api.flickr.com/services/rest?photo_id={photo_id}&extras=autotags&lang=en-US&viewerNSID=&method=flickr.tags.getListPhoto&csrf=1684685119%3Asx5rww6hv6%3A3d4a6b57dc724612e22da47b287785d8&api_key={self.flickr_api_key}&format=json&hermes=1&hermesClient=1&reqId=3ce05c20-2aa1-4281-8052-79635440e80b&nojsoncallback=1',
            callback = self.get_tags,
            meta = {
                'item': item
            }
        )
    
    def get_tags(self, response):
        
        data = json.loads(response.body)
        tags = [  tag['_content'] for tag in (data['photo']['tags']['tag'] if 'photo' in data else []) ]
        item = response.meta['item']
        page = item['page']

        item = {
            **item,
            'tags': tags
        }
        
        yield scrapy.Request(
            url = page,
            callback = self.get_stats,
            meta = {
                'item': item
            }
        )
        
    def get_stats(self, response):

        item                    = response.meta['item']
        uploaded                = response.xpath('normalize-space(//div[@class="date-posted clear-float "]/span/text())').get()
        formatted_date_uploaded = self.format_date_time(uploaded.replace("Uploaded on ", "")) # => Return yyyy-dd-mm format

        # Can not find geographical location on this website
        gps  = {
            "latitude"  : 0,	                
            "longitude" : 0 
        }


        views     = response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[1]/span[1]/text())').get()
        likes     = response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[2]/span[1]/text())').get()
        comments  = response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[3]/span[1]/text())').get()

        if len(views) > 0: views = int(views.replace(",", "")) if ',' in views else int(views)
        if len(likes) > 0: likes = int(likes.replace(",", "")) if ',' in likes else int(likes)
        if len(comments) > 0: comments = int(comments.replace(",", "")) if ',' in comments else int(comments)

        stat = {
            'views'   : views,
            'likes'   : likes,
            'comments': comments,
            'download': None
        }

        item = {
            **item,
            'owner'     : response.xpath('normalize-space(//div[@class="attribution-info"]/a[1]/text())').get(),
            'title'     : response.xpath('normalize-space(//div[@class="title-desc-block  showFull"]/h2/p/text())').get(),
            'license'   : response.xpath('normalize-space(//div[@class="photo-license-info"]/a/span/text())').get(),
            'uploaded'  : formatted_date_uploaded,
            'gps'       : gps,
            'stat'      : stat,
        }


        page = item['page']
        yield scrapy.Request(
            url = page + '/sizes/o/', # Come to the original size of image download
            callback = self.get_image_download_url,
            meta = {
                'item': item
            }
        )

    def get_image_download_url(self,response):
        
        item               = response.meta['item']

        # Use this images_urls array to download image:
        download_image_url = response.xpath('//div[@id="all-sizes-header"]/dl[2]/dd/a/@href').get()
        image_urls         = [download_image_url]
        
        item = {
            **item,
            'image_urls': image_urls
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
            "db_name"    : self.name                             # Field for testing
        }

   
         
        
       


        

