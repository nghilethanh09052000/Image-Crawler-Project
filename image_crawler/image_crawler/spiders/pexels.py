import scrapy


class PexelsSpider(scrapy.Spider):
    
    name     = 'pexels'
    init_url = ['http://www.pexels.com/']

    def parse(self, response):
        pass
