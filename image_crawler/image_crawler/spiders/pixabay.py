import scrapy


class PixabaySpider(scrapy.Spider):
    name = 'pixabay'
    

    def start_requests(self):
        yield scrapy.Request(
            url= 'https://pixabay.com/photos/search/landscape/',
            callback= self.parse
        )
    def parse(self, response, **kwargs):
        print('Nghi', response)
