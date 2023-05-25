import scrapy


class UnsplashSpider(scrapy.Spider):
    name = 'unsplash'
    allowed_domains = ['nghi.com']
    start_urls = ['http://nghi.com/']

    def parse(self, response):
        pass
