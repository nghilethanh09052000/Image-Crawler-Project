from http.cookies import SimpleCookie
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()
class UtilsProcess:

    MONGO_DB_URL         = os.getenv('MONGO_DB_URL')
    MONGO_DB_DATABASE    = os.getenv('MONGO_DB_DATABASE')
    COOKIE_STRING        = os.getenv("COOKIE_STRING")
    FLICKR_LANDSCAPE_API = os.getenv("FLICKR_LANDSCAPE_API")
    FLICKR_WATERFALL_API = os.getenv("FLICKR_WATERFALL_API")
    
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

    EXIF_STANDARD = {
        'Make': 'make',
        'Model': 'Model',
        'ExposureTime': 'shutterspeed',
        'FNumber': 'fstop',
        'ISO': 'iso',
        'LensModel': 'lens',
        'FocalLength': 'focallength',
    }
        
    # Parse Cookie For Request
    def cookie_parser(self):
        cookie_string = self.COOKIE_STRING
        cookie = SimpleCookie()
        cookie.load(cookie_string)

        cookies = {}
        for key,morsel in cookie.items():
            cookies[key] = morsel.value
        return cookies
    
    # Return Date Time Format: yyyy-mm-dd
    def format_date_time(self, date_string):

        date = datetime.strptime(date_string, "%B %d, %Y")
        formatted_date_uploaded = date.strftime("%Y-%m-%d")
        return formatted_date_uploaded
    
    

utils = UtilsProcess()