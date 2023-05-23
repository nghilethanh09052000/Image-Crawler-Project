import scrapy
import json
from ..utils import utils
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse



class IndexSpider(scrapy.Spider):

    name                = 'flickr'
    tag                 = 'landscape'
    init_url            = 'https://www.flickr.com'
    photo_url           = 'https://www.flickr.com/photos' # photo_id and owner_id
    count               = 0
    
    def start_requests(self):

        # Todo: setup loop for pages

        yield scrapy.Request(
            url = utils.FLICKR_LANDSCAPE_API,
            callback = self.get_all_photos,
            cookies = utils.cookie_parser()
        )

    def get_all_photos(self, response, **kwargs):
      
        data   = json.loads(response.body)
        photos = data['photos']['photo']

        for photo in photos:
            item      = {}
            size      = []
            owner_id  = photo['owner']
            photo_id  = photo['id']
            image     = f"{owner_id}_{photo_id}"         # Get this one
            page = f'{self.photo_url}/{owner_id}/{photo_id}'

            for i in list(utils.IMAGE_SIZE.keys()):
                if photo.get(i):

                    url    = photo[i]
                    height = photo[utils.IMAGE_SIZE[i][0]]
                    width  = photo[utils.IMAGE_SIZE[i][1]]

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
                url = f'https://api.flickr.com/services/rest?photo_id={photo_id}&extras=camera&viewerNSID=197744874%40N06&method=flickr.photos.getExif&csrf=1684682207%3Ay1fg88gisg%3Afdf5269875586aec73788ac323702395&api_key=eac0286d53e28304518ace9179eb9020&format=json&hermes=1&hermesClient=1&reqId=4d5637b6-5aee-434e-916f-ceaa7ebfae15&nojsoncallback=1',
                callback = self.get_exif,
                cookies = utils.cookie_parser(),
                meta = {
                    'item'    : item,
                    'photo_id': photo_id,
                }
            )
            
    def get_exif(self, response):

        exif      = {}
        item      = response.meta['item']
        photo_id  = response.meta['photo_id']

        data      = json.loads(response.body)
        data_exif = data.get('photo').get('exif') if 'photo' in data else None


        # Only request have meta exif will be scrapped 
        if not data_exif: return

        # Continue the process
        for i in data_exif:
            for key, value in utils.EXIF_STANDARD.items():
                if i['tag'] == key:
                    exif[value] = i['raw']['_content'] 
                    break
        
        # Return when exif does not have any key based on the EXIF_STANDARD standard
        if not bool(exif): return

        item = {
            **item,
            'exif': exif
        }

        yield scrapy.Request(
            url = f'https://api.flickr.com/services/rest?photo_id={photo_id}&extras=autotags&lang=en-US&viewerNSID=197744874%40N06&method=flickr.tags.getListPhoto&csrf=1684685119%3Asx5rww6hv6%3A3d4a6b57dc724612e22da47b287785d8&api_key=eac0286d53e28304518ace9179eb9020&format=json&hermes=1&hermesClient=1&reqId=3ce05c20-2aa1-4281-8052-79635440e80b&nojsoncallback=1',
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
            callback = self.get_remain_data,
            cookies = utils.cookie_parser(),
            meta = {
                'item': item
            }
        )
        
    def get_remain_data(self, response):

        item                    = response.meta['item']
        uploaded                = response.xpath('normalize-space(//div[@class="date-posted clear-float "]/span/text())').get()
        formatted_date_uploaded = utils.format_date_time(uploaded.replace("Uploaded on ", "")) # => Return yyyy-dd-mm format

        # Can not find geographical location on this website
        gps  = {
            "latitude"  : 0,	                
            "longitude" : 0 
        }

        # Use this images_urls array to download image:
        image_url  = response.urljoin(response.xpath('//img[@class="main-photo"]/@src').get())
        image_urls = [image_url]
        

        item = {
            **item,
            'owner'     : response.xpath('normalize-space(//div[@class="attribution-info"]/a[1]/text())').get(),
            'title'     : response.xpath('normalize-space(//div[@class="title-desc-block  showFull"]/h2/p/text())').get(),
            'license'   : response.xpath('normalize-space(//div[@class="photo-license-info"]/a/span/text())').get(),
            'uploaded'  : formatted_date_uploaded,
            'gps'       : gps,
            'stat'      : {
                'views'   : response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[1]/span[1]/text())').get(),
                'likes'   : response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[2]/span[1]/text())').get(),
                'comments': response.xpath('normalize-space(//div[@class="right-stats-details-container"]/div[3]/span[1]/text())').get()
            },

            'image_urls': image_urls
        }

        self.count += 1

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
            "rating"     : "",                                   # Specify the rating of the image
            "crawl_id"   : 1,                                    # Generate crawl id
            "crawl_note" : "No",                                 # Generate crawl note
            "crawl_count": self.count,                           # Generate crawl count

            "image_urls" : item['image_urls']                    # Field to download image
        }

   
         
        
       


        

