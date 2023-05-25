import scrapy


class PixabaySpider(scrapy.Spider):
    name = 'pixabay'
    allowed_domains = ['nghi.com']
    start_urls = ['http://nghi.com/']

    def parse(self, response):
        pass
