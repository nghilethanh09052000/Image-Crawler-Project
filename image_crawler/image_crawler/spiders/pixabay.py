import scrapy
from ..settings import pixabay_url, pixabay_views, pixabay_likes
import json
import requests

class PixabaySpider(scrapy.Spider):

    name         = 'pixabay'
    init_url     = 'https://pixabay.com'
    i            = 1

    def start_requests(self):

        tag = self.tag

        post_body = {
            "cmd"       : "request.get",
            "url"       : pixabay_url.format(tag, self.i),
            "maxTimeout": 60000
        }

        json_data = json.dumps(post_body)
        
        yield scrapy.Request(
            url      = 'http://localhost:8191/v1',
            method   = "POST",
            headers  = {
                'Content-Type': 'application/json'
            },
            body = json_data,
            callback = self.get_all_photos
        )

    def get_all_photos(self, response, **kwargs):
        
        data = response.json()
        
        if data.get('status') != 'ok': return

        cookies            = data['solution']['cookies']
        clean_cookies_dict = { cookie['name']: cookie['value'] for cookie in cookies }
        user_agent         = data['solution']['userAgent']
        headers            = {"User-Agent": user_agent}
        html               = data['solution']['response']


        selector   = scrapy.Selector(text=html)
        photo_urls = selector.xpath('//div[@class="cell--B7yKd"]/div/a/@href').getall()

       

        next_page = selector.xpath('//div[contains(@class,"nextPage--")]/a/span')

        for j in range(len(photo_urls)):             

            photo_url = photo_urls[j]

            print(f'Page Count: {self.i} --- Photo Count:{j}')

            response = requests.get(
                    photo_url,
                    headers = headers,
                    cookies = clean_cookies_dict
            )

            content = response.content
         
            bootstrap_url    = ''
            bootstrap_string = ''
            selector         = scrapy.Selector(text=content)
            script_tags      = selector.xpath('//script/text()').getall()
            for script_tag in script_tags:
                if "window.__PAGE__ =" in script_tag.strip():
                    bootstrap_string = script_tag.strip()

            start_index = bootstrap_string.find("window.__BOOTSTRAP_URL__ = '") + len("window.__BOOTSTRAP_URL__ = '")
            end_index = bootstrap_string.find("'", start_index)
            bootstrap_url = bootstrap_string[start_index:end_index]


            post_body = {
                "cmd"       : "request.get",
                "url"       : self.init_url + bootstrap_url,
                "maxTimeout": 60000
            }

            json_data = json.dumps(post_body)

            yield scrapy.Request(
                url      = 'http://localhost:8191/v1',
                method   = "POST",
                headers  = {
                    'Content-Type': 'application/json',
                    'Referer'     :  photo_url
                },
                body = json_data,
                callback = self.parse,
                meta = {
                    'photo_url': photo_url                    
                }
            )
    

        if next_page:

            self.i+=1

            post_body = {
                "cmd"       : "request.get",
                "url"       : pixabay_url.format(self.tag, self.i),
                "maxTimeout": 60000
            }

            json_data = json.dumps(post_body)
            
            yield scrapy.Request(
                url      = 'http://localhost:8191/v1',
                method   = "POST",
                headers  = {
                    'Content-Type': 'application/json'
                },
                body = json_data,
                callback = self.get_all_photos
            )


    def parse(self, response, **kwargs):

        photo_url = response.meta['photo_url']

        json_response = response.json()
        if json_response.get('status') != 'ok': return

        html_data = json_response['solution']['response']
        split_first_content  = '<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">'
        split_second_content = '</pre></body></html>'

        json_data = html_data.split(split_first_content)[1].split(split_second_content)[0]

        # Return when html is failed (404)
        if not json_data: return

        data      = json.loads(json_data)

        photo     = data['page']['mediaItem']

        views    = int(photo['viewCount'])
        likes    = int(photo['likeCount'])
        comments = int(photo['commentCount'])
        download = int(photo['downloadCount'])

        # if not (
        #     views >= pixabay_views
        #     and
        #     likes >= pixabay_likes
        # ): return

        stat = {
            'views'   : views,
            'likes'   : likes,
            'comments': comments,
            'download': download
        }

        make         = ""
        model        = photo.get('cameraName') or ""
        shutterspeed = photo.get('exposureTime') or ""
        fstop        = photo.get('aperture') or ""
        iso          = photo.get('iso') or ""
        focallength  = photo.get('focalLength') or ""
        lens         = photo.get('lens') or ""

        exif = {
            'make'        : make,
            'model'       : model,
            'shutterspeed': shutterspeed,
            'fstop'       : fstop,
            'iso'         : iso,
            'focallength' : focallength,
            'lens'        : lens,
        }

        if all( len(value) == 0 for value in exif.values()): return

        exif = {
            **exif, 
            'shutterspeed': exif.get('shutterspeed') + 's' if len(exif.get('shutterspeed')) > 0 else "",
            'fstop'       : 'f/' + exif.get('fstop') if len(exif.get('fstop')) > 0 else "",
            'focallength' : exif.get('focallength') + 'mm'  if len(exif.get('focallength')) > 0 else "",
        }

        photo_id = photo['id']
        owner_id = photo['user']['id']

        image    = f'{self.name}_{photo_id}_{owner_id}'
        page     = photo_url
        tags     = photo['tags']
        license  = ''
        uploaded = photo['publishedDate']
        owner    = photo['user']['username']
        title    = photo['description']
        gps = {
            "latitude" : 0,
            "longitude": 0
        }

        init_download_image_url = photo['sources']['1x']
        split_content = init_download_image_url.split("/")
        result = "/".join(split_content[:-1]) + "/"
        result = result.replace('\\','')  # => https://cdn.pixabay.com/photo/2015/04/23/22/00/

        size = []
        init_width  = int(photo['width'])
        init_height = int(photo['height'])
        sources     = photo['sources']
        for key, value in sources.items():
            width  = 0
            height = 0
            url    = ''
            if key == '1x':
                split_url = sources[key].split("_")
                width     = int(split_url[1])
                height    = int(split_url[2].split(".")[0])
                url       = value
            elif key == '2x':
                split_url = sources[key].split("_")[-1].split(".")
                url       = value
                if init_width > init_height:
                    width  = int(split_url[0])
                    ratio  = init_width / width
                    height = int(init_height / ratio)
                else:
                    height = int(split_url[0])
                    ratio  = init_height / height
                    width  = int(init_width / ratio)
            else:
                continue
            size.append({
                'width' : width,
                'height': height,
                'url'   : url
            })

        image_urls = [ size[1].get('url') or size[0].get('url') ]

        tag = ""
        if self.tag == 'long%20exposure':
            tag = 'long exposure'
        else:
            tag = self.tag


        item = {
            "image"      : image,                                # Specify the name of the image (we can point out the image_id and owner_id)
            "source"     : self.init_url,                        # Specify the source
            "page"       : page,                                 # Specify the url
            "exif"       : exif,                                 # Specify the exif of the image: make, model, lens, shutterspeed, fstop, iso, focallength
            "stat"       : stat,                                 # Specify the statistic based on client's requirements: downloads, views, likes comments
            "tags"       : tags,                                 # Specify all tags having on website of this image
            "license"    : license,                              # Specify the lisence on the image website
            "uploaded"   : uploaded,                             # Specify the date of image uploaded
            "owner"      : owner,                                # Specify the owner of the image
            "title"      : title,                                # Specify the title of image
            "gps"        : gps,                                  # Specify the longtitude and latitude
            "size"       : size,                                 # Specify all sizes of this image
            "root_class" : tag,                                  # Specify the root_class (the tag when you search for it)
            "sub_class"  : tag,                                  # Specify some subclass of the image
            "rating"     : None,                                 # Specify the rating of the image
            "crawl_id"   : 1,                                    # Generate crawl id
            "crawl_note" : "No",                                 # Generate crawl note

            #"crawl_count": self.count,                          # Crawl Count Is Set Based on the Pipelines

            "image_urls" : image_urls,                           # Field to download image
            "name"       : self.name                             # Field for Pipeline to Download PNG file Extension
        }


        yield item


        
