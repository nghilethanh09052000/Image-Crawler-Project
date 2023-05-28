import scrapy
import argparse
import json
from ..settings import flickr_url, flickr_api
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import requests
from datetime import datetime



class IndexSpider(scrapy.Spider):

    name                = 'index'

    def start_requests(self):
        yield scrapy.Request(
            url       = 'https://www.flickr.com/photos/94704573@N03/19935909848/sizes/0/',
            callback  = self.parse
        )
    
    def parse(self, response, **kwargs):

        download_page = response.xpath('//div[@id="all-sizes-header"]/dl[2]/dd/a/@href').get()
        yield {
            'Nghi': download_page
        }


  



   
         
        
       


        

