from http.cookies import SimpleCookie
import os
from datetime import datetime
import requests
from .settings import USER_AGENT_LIST
import random


class UtilsProcess:

    
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

   

    # Random User Agent:
    def random_user_agent(self):
        return random.choice(USER_AGENT_LIST)   

    # Parse API Key of the Website
    def parse_api_key(self, tag , url, name):
        if name == 'flickr':
            searched_tag_url = url.format(tag)
            response         = requests.get(searched_tag_url).text
            return str(str(str(response).split('root.YUI_config.flickr.api.site_key = "')[1]).split('";')[0])

    # Parse Cookie For Request
    def cookie_parser(self, cookie_string):
        
        cookie = SimpleCookie()
        cookie.load(cookie_string)

        cookies = {}
        for key,morsel in cookie.items():
            cookies[key] = morsel.value
        
        print(cookies)
        return cookies
    
    # Return Date Time Format: yyyy-mm-dd
    def format_date_time(self, date_string):

        date = datetime.strptime(date_string, "%B %d, %Y")
        formatted_date_uploaded = date.strftime("%Y-%m-%d")
        return formatted_date_uploaded
    
    

utils = UtilsProcess()
