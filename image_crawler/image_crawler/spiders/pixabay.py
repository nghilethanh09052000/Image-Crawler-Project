import scrapy
from ..settings import pixabay_url, pixabay_views, pixabay_likes
import json
from bs4 import  BeautifulSoup
import requests
import json


class PixabaySpider(scrapy.Spider):

    name     = 'pixabay'
    init_url = 'https://pixabay.com'
   

    def find_csrf_header(self, item):
        return

    def start_requests(self):

        tag = self.tag

    ### Instruction can be found below:    
    ### https://scrapeops.io/python-web-scraping-playbook/python-flaresolverr/
    
        post_body = {
        "cmd"       : "request.get",
        "url"       : self.init_url,
        "maxTimeout": 60000
        }
        response = requests.post(
            'http://localhost:8191/v1', 
            headers={' Content-Type': 'application/json'}, 
            json = post_body
        )

        if response.status_code == 200:

            json_response = response.json()

            if json_response.get('status') == 'ok':

                cookies            = json_response['solution']['cookies']
                clean_cookies_dict = {cookie['name']: cookie['value'] for cookie in cookies}
                user_agent         = json_response['solution']['userAgent']

                yield scrapy.Request(
                    url = pixabay_url.format(tag, 1),
                    callback = self.get_html_parser,
                    headers = {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-encoding": "gzip, deflate, br",
                        "accept-language": "en-US,en;q=0.9",
                        "sec-ch-ua": '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "user-agent": user_agent
                    },
                    cookies = clean_cookies_dict
                )

    def get_html_parser(self, response):
        print('Nghi', response.body)

       
    def bypass_cloudflare(self, respones):
        return

    
    def nghi(self, item):        
        yield {
        #"image"      : item['image'],                        # Specify the name of the image (we can point out the image_id and owner_id)
        #"source"     : self.init_url,                        # Specify the source
        #"page"       : item['page'],                         # Specify the url
        #"exif"       : item['exif'],                         # Specify the exif of the image: make, model, lens, shutterspeed, fstop, iso, focallength
        #"stat"       : item['stat'],                         # Specify the statistic based on client's requirements: downloads, views, likes comments
        #"tags"       : item['tags'],                         # Specify all tags having on website of this image
        #"license"    : item['license'],                      # Specify the lisence on the image website
        #"uploaded"   : item['uploaded'],                     # Specify the date of image uploaded
        #"owner"      : item['owner'],                        # Specify the owner of the image
        #"title"      : item['title'],                        # Specify the title of image
        #"gps"        : item['gps'],                          # Specify the longtitude and latitude
        #"size"       : item['size'],                         # Specify all sizes of this image
        #"root_class" : self.tag,                             # Specify the root_class (the tag when you search for it)
        #"sub_class"  : ["landscape", "mountain", "nature"],  # Specify some subclass of the image
        #"rating"     : None,                                 # Specify the rating of the image
        #"crawl_id"   : 1,                                    # Generate crawl id
        #"crawl_note" : "No",                                 # Generate crawl note

        #"crawl_count": self.count,                          # Crawl Count Is Set Based on the Pipelines

        "image_urls" : item['image_urls'],                   # Field to download image
    }

