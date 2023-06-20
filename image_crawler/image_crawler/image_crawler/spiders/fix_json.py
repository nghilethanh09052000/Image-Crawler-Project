import scrapy
import json

class FixJsonSpider(scrapy.Spider):

    name = "fix_json"
    

    def start_requests(self):
        for i in range(1, 7808):
            yield scrapy.Request(
                url = f'https://lumionix-dataset.vercel.app/api/metadata?page={i}',
                callback = self.parse
            )

    def parse(self, response, **kwargs):
                  
        data     = json.loads(response.body)
        metadata = data['metadata']

        for j in metadata:
            yield {
                "image"      : j['image'],                        # Specify the name of the image (we can point out the image_id and owner_id)
                "source"     : j['source'],                       # Specify the source
                "image_url"  : j['image_url'],                    # Specify the url
                "exif"       : j['exif'],                         # Specify the exif of the image: make, model, lens, shutterspeed, fstop, iso, focallength
                "stat"       : j['stat'],                         # Specify the statistic based on client's requirements: downloads, views, likes comments
                "tags"       : j['tags'],                         # Specify all tags having on website of this image
                "license"    : j['license'],                      # Specify the lisence on the image website
                "uploaded"   : j['uploaded'],                     # Specify the date of image uploaded
                "owner"      : j['owner'],                        # Specify the owner of the image
                "title"      : j['title'],                        # Specify the title of image
                "gps"        : j['gps'],                          # Specify the longtitude and latitude
                "size"       : j['size'],                         # Specify all sizes of this image
                "root_class" : j['root_class'],                   # Specify the root_class (the tag when you search for it)
                "sub_class"  : j['sub_class'],                    # Specify some subclass of the image
                "rating"     : j['rating'],                       # Specify the rating of the image
                "crawl_id"   : j['crawl_id'],                     # Generate crawl id
                "crawl_note" : j['crawl_note'],                   # Generate crawl note
                "crawl_count": j['crawl_count'],                  # Crawl Count Is Set Based on the Pipelines
            }
    