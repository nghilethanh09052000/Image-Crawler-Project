from configparser import ConfigParser
import os

config = ConfigParser(interpolation = None)


config.read('crawler.cfg')

#[FLICKR]
flickr_url = config['FLICKR']['flickr_url']
flickr_api = config['FLICKR']['flickr_api']

#[PEXELS]
pexels_url           = config['PEXELS']['pexels_url']
pexels_cookie_string = config['PEXELS']['pexels_cookie_string']

print('Nghi', flickr_url)


#[DATABASE]
MONGO_DB_URL      = config['DATABASE']['MONGO_DB_URL']
MONGO_DB_DATABASE = config['DATABASE']['MONGO_DB_DATABASE']
COLLECTION_NAME   = config['DATABASE']['COLLECTION_NAME']


#[IMAGE]
limit               = int(config['IMAGE']['limit'])
IMAGES_STORE        = '.'
HI_RES_IMAGES_STORE = config['IMAGE']['download_path']
RESIZE_IMAGES_STORE = config['IMAGE']['resize_path']

IMAGES_MIN_HEIGHT = int(config['IMAGE']['resize_height'])
IMAGES_MIN_WIDTH  = int(config['IMAGE']['resize_width'])
# IMAGES_THUMBS     = {
#     'resize': (int(config['IMAGE']['resize_height']), int(config['IMAGE']['resize_width'])),
# }
format = config['IMAGE']['format']








BOT_NAME = 'image_crawler'
SPIDER_MODULES = ['image_crawler.spiders']
NEWSPIDER_MODULE = 'image_crawler.spiders'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'image_crawler (+http://www.yourdomain.com)'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
#DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
#   'Accept-Language': 'en',
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    'image_crawler.middlewares.FlickrImagesSpiderMiddleware': 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
   'image_crawler.middlewares.FlickrImagesDownloaderMiddleware': 543,
   'scrapy_cloudflare_middleware.middlewares.CloudFlareMiddleware': 560
}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html

ITEM_PIPELINES = {
   'image_crawler.pipelines.FlickrDownloadImagePipeline': 200,
   'image_crawler.pipelines.MongoDBPipeline': 300,
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = 'httpcache'
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'

FEED_EXPORT_ENCODING = "utf-8"
